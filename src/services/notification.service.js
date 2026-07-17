import {

    findNotificationById,

    getUserNotifications,

    getUnreadNotifications,

    updateNotification,

    markAllAsRead,

} from "../repositories/notification.repository.js";

import NotFoundError from "../errors/NotFoundError.js";

import ForbiddenError from "../errors/ForbiddenError.js";

export const getMyNotifications = async (

    userId

) => {

    return await getUserNotifications(

        userId

    );

};

export const getMyUnreadNotifications = async (

    userId

) => {

    return await getUnreadNotifications(

        userId

    );

};

export const getNotificationDetails = async (

    notificationId,

    userId

) => {

    const notification =

        await findNotificationById(

            notificationId

        );

    if (!notification) {

        throw new NotFoundError(

            "Notification not found."

        );

    }

    if (

        notification.receiver.toString()

        !==

        userId.toString()

    ) {

        throw new ForbiddenError(

            "You are not allowed to view this notification."

        );

    }

    return notification;

};

export const markNotificationAsRead = async (

    notificationId,

    userId

) => {

    const notification =

        await findNotificationById(

            notificationId

        );

    if (!notification) {

        throw new NotFoundError(

            "Notification not found."

        );

    }

    if (

        notification.receiver.toString()

        !==

        userId.toString()

    ) {

        throw new ForbiddenError(

            "You are not allowed to update this notification."

        );

    }

    notification.isRead = true;

    return await updateNotification(

        notification

    );

};

export const markEveryNotificationAsRead = async (

    userId

) => {

    return await markAllAsRead(

        userId

    );

};