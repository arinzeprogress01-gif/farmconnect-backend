import {
    createNotification,
} from "../repositories/notification.repository.js";

import {
    sendPushNotification,
} from "../config/pushNotification.js";

const sendNotification = async ({

    receiver,

    deviceToken = null,

    title,

    message,

    type = "system",

    data = {},

}) => {

    const notification =

        await createNotification({

            receiver,

            title,

            message,

            type,

            data,

        });

    if (deviceToken) {

        try {

            await sendPushNotification(

                deviceToken,

                title,

                message,

                data

            );

        } catch (error) {

            console.log(

                "Push notification failed:",

                error.message

            );

        }

    }

    return notification;

};

export default sendNotification;