import { Worker } from "bullmq";
import IORedis from "ioredis";
import "dotenv/config";
import sendNotification  from "../utils/sendNotification.js";
import connectDB from "../config/database.config.js";
const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

const notificationWorker = new Worker(
    "notifications",
    async (job) => {
        console.log("Processing notification job:", job.id);
        console.log("Job data:", job.data);

        await sendNotification(job.data);

        return {
            success: true,
            processedAt: new Date().toISOString(),
        };
    },
    {
        connection,
    }
);

notificationWorker.on("completed", (job) => {
    console.log(`Notification job ${job.id} completed.`);
});

notificationWorker.on("failed", (job, error) => {
    console.error(
        `Notification job ${job?.id} failed:`,
        error.message
    );
});

notificationWorker.on("error", (error) => {
    console.error(
        "Notification worker error:",
        error
    );
});

const startWorker = async () => {

    await connectDB();
    console.log("Notification worker started.");
}

startWorker();

const shutdown = async (signal) => {
    console.log(`${signal} received. Closing notification worker...`);

    await notificationWorker.close();
    await connection.quit();

    console.log("Notification worker closed.");

    process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));