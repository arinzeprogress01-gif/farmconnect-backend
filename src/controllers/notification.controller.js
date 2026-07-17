import {

    getMyNotifications,

    getMyUnreadNotifications,

    getNotificationDetails,

    markNotificationAsRead,

    markEveryNotificationAsRead,

} from "../services/notification.service.js";

export const getNotifications = async (

    req,

    res,

    next

) => {

    try {

        const notifications =

            await getMyNotifications(

                req.user._id

            );

        res.status(200).json({

            success: true,

            count: notifications.length,

            data: notifications,

        });

    } catch (error) {

        next(error);

    }

};

export const getUnreadNotifications = async (

    req,

    res,

    next

) => {

    try {

        const notifications =

            await getMyUnreadNotifications(

                req.user._id

            );

        res.status(200).json({

            success: true,

            count: notifications.length,

            data: notifications,

        });

    } catch (error) {

        next(error);

    }

};

export const getNotification = async (

    req,

    res,

    next

) => {

    try {

        const notification =

            await getNotificationDetails(

                req.params.notificationId,

                req.user._id

            );

        res.status(200).json({

            success: true,

            data: notification,

        });

    } catch (error) {

        next(error);

    }

};

export const readNotification = async (

    req,

    res,

    next

) => {

    try {

        const notification =

            await markNotificationAsRead(

                req.params.notificationId,

                req.user._id

            );

        res.status(200).json({

            success: true,

            message: "Notification marked as read.",

            data: notification,

        });

    } catch (error) {

        next(error);

    }

};

export const readAllNotifications = async (

    req,

    res,

    next

) => {

    try {

        await markEveryNotificationAsRead(

            req.user._id

        );

        res.status(200).json({

            success: true,

            message: "All notifications marked as read.",

        });

    } catch (error) {

        next(error);

    }

};