import {
    createSubscription,
    findActiveSubscriptionByUser,
    findSubscriptionByReference,
} from "../repositories/subscription.repository.js";

import  sendNotification  from "../utils/sendNotification.js";

import {
    createActivity,
} from "./activity.service.js";


export const activateSubscription = async ({
    userId,
    plan,
    paymentId,
    reference,
    startedAt,
    expiresAt,
}) => {

    const existingSubscription =
        await findSubscriptionByReference(
            reference
        );


    // Already activated for this payment
    if (existingSubscription) {

        console.log(
            `Subscription for payment ${reference} already exists.`
        );

        return existingSubscription;
    }


    const subscription =
        await createSubscription({

            user: userId,

            plan,

            status: "active",

            gateway: "paystack",

            payment: paymentId,

            reference,

            startedAt,

            expiresAt,

        });


    await createActivity({

        type: "subscription_created",

        message:
            "Your FarmConnect Premium subscription is now active.",

        audience: "user",

        user: userId,

    });


    await sendNotification({

        receiver: userId,

        title:
            "Subscription Activated",

        message:
            "Your FarmConnect Premium subscription is now active.",

        type: "subscription_created",

        priority: "medium",

        data: {

            subscriptionId:
                subscription._id,

            paymentId,

            reference,

            action:
                "OPEN_SUBSCRIPTION",

        },

    });


    return subscription;
};


export const getUserSubscription = async (
    userId
) => {

    return await findActiveSubscriptionByUser(
        userId
    );

};