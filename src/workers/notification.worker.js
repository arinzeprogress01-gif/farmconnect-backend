import { Worker } from "bullmq";
import IORedis from "ioredis";
import "dotenv/config";
import sendNotification  from "../utils/sendNotification.js";
import connectDB from "../config/database.config.js";

const connection = new IORedis(process.env.JOB_URL, {
    maxRetriesPerRequest: null,
    tls: {},
});

connection.on("connect", () => {
    console.log("BullMQ Redis connecting...");
});

connection.on("ready", () => {
    console.log("BullMQ Redis ready.");
});

connection.on("error", (error) => {
    console.error("BullMQ Redis error:", error.message);
});

connection.on("reconnecting", () => {
    console.log("BullMQ Redis reconnecting...");
});

let notificationWorker;

const startWorker = async () => {
    await connectDB();

    notificationWorker = new Worker(
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

    await notificationWorker.waitUntilReady();

    console.log("Notification worker started.");
};

startWorker();

const shutdown = async (signal) => {
    console.log(`${signal} received. Closing notification worker...`);

    if (notificationWorker) {
        await notificationWorker.close();
    }
    await connection.quit();

    console.log("Notification worker closed.");

    process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));