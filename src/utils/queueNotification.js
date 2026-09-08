import getNotificationQueue from "../queues/notification.queue.js";

export const queueNotification = async ({
    receiver,
    title,
    message,
    type = "system",
    priority = "medium",
    data = {},
}) => {
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