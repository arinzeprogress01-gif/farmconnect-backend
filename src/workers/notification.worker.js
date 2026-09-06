import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

const notificationWorker = new Worker(
    "notifications",
    async (job) => {
        console.log("Processing notification job:", job.id);
        console.log("Job data:", job.data);

        // Notification processing will be added here.
        // For now, we are only testing the queue-worker connection.

        return {
            success: true,
            processedAt: new Date(),
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
    console.error("Notification worker error:", error);
});

console.log("Notification worker started.");