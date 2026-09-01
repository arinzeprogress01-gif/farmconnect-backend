import {
    createNotification,
} from "../repositories/notification.repository.js";
import {
    sendPushNotification,
} from "../services/notifications.service.js";
import {
    emitToUser
} from "../sockets/socket.events.js"
import User from "../models/user.models.js";


export default async function sendNotification({

    receiver,

    title,

    message,

    type = "system",

    priority = "medium",

    data = {},

}) {

    // Save notification

    const notification = await createNotification({

        receiver,

        title,

        message,

        type,

        priority,

        data,

    });

    emitToUser(
        receiver,
        "notification:new",
        notification
    );

    // Find user

    const user = await User.findById(receiver);

    if (!user) {

        return;

    }

    // Get active device tokens

    const tokens =

        user.devices.map(

            device => device.token

        );

    if (

        tokens.length === 0

    ) {

        return;

    }

    // Send Firebase Push

    await sendPushNotification({

        tokens,

        title,

        body: message,

        data: {

            type,

            ...Object.fromEntries(

                Object.entries(data).map(

                    ([key, value]) => [

                        key,

                        String(value),

                    ]

                )

            ),

        },

    });

}