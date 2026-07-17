import Notification from "../models/notification.model.js";

export const createNotification = async (

    notificationData

) => {

    return await Notification.create(

        notificationData

    );

};

export const findNotificationById = async (

    notificationId

) => {

    return await Notification.findById(

        notificationId

    );

};

export const getUserNotifications = async (

    userId

) => {

    return await Notification.find({

        receiver: userId,

    })

    .sort({

        createdAt: -1,

    });

};

export const getUnreadNotifications = async (

    userId

) => {

    return await Notification.find({

        receiver: userId,

        isRead: false,

    })

    .sort({

        createdAt: -1,

    });

};

export const updateNotification = async (

    notification

) => {

    return await notification.save();

};

export const markAllAsRead = async (

    userId

) => {

    return await Notification.updateMany(

        {

            receiver: userId,

            isRead: false,

        },

        {

            isRead: true,

        }

    );

};

export const deleteNotification = async (

    notificationId

) => {

    return await Notification.findByIdAndDelete(

        notificationId

    );

};

export const getNotificationsByType = async (

    userId,

    type

) => {

    return await Notification.find({

        receiver: userId,

        type,

    })

        .sort({

            createdAt: -1,

        });

};