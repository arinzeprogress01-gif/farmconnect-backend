import { messaging } from "../config/firebase.js";

export const sendPushNotification = async ({

    tokens,

    title,

    body,

    data = {},

}) => {

    if (

        !tokens ||

        tokens.length === 0

    ) {

        return;

    }

    await messaging.sendEachForMulticast({

        tokens,

        notification: {

            title,

            body,

        },
        webpush: {

            notification: {

                icon: "/logo192.png",

                badge: "/logo192.png",

            }

        },

        data,

    });

};