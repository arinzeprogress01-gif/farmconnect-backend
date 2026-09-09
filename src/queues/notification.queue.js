import { Queue } from "bullmq";
import IORedis from "ioredis";

let notificationQueue;

const getNotificationQueue = () => {
    if (!notificationQueue) {
        const connection = new IORedis(process.env.JOB_URL, {
            maxRetriesPerRequest: null,
        });

        notificationQueue = new Queue("notifications", {
            connection,

            defaultJobOptions: {
                attempts: 3,

                backoff: {
                    type: "exponential",
                    delay: 5000,
                },

                removeOnComplete: true,
                removeOnFail: false,
            },
        });
    }

    return notificationQueue;
};

export default getNotificationQueue;