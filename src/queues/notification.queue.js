import { Queue } from "bullmq";
import IORedis from "ioredis";
import "dotenv/config";


let notificationQueue;

const getNotificationQueue = () => {
    if (!notificationQueue) {
        const connection = new IORedis(process.env.REDIS_URL, {
            maxRetriesPerRequest: null,
            tls: {},
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