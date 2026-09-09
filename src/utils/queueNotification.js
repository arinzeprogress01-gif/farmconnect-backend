import getNotificationQueue from "../queues/notification.queue.js";

export const queueNotification = async ({
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

    await notificationQueue.add("send-notification", {
        receiver,
        title,
        message,
        type,
        priority,
        data,
    });
};