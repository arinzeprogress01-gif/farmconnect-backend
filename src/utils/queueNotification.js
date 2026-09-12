/*import getNotificationQueue from "../queues/notification.queue.js";

export const queueNotification = ({
    receiver,
    title,
    message,
    type = "system",
    priority = "medium",
    data = {},
}) => {
    console.log("QUEUEING NOTIFICATION:", {
        receiver,
        title,
        type,
    });

    const notificationQueue = getNotificationQueue();

    notificationQueue
        .add("send-notification", {
            receiver,
            title,
            message,
            type,
            priority,
            data,
        })
        .then((job) => {
            console.log("NOTIFICATION JOB ADDED:", job.id);
        })
        .catch((error) => {
            console.error(
                "Failed to queue notification:",
                error.message
            );
        });
};
*/