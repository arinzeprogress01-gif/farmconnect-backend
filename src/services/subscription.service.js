import {
    createSubscription,
    findActiveSubscriptionByUser,
} from "../repositories/subscription.repository.js";

import {sendNotification} from "../utils/sendNotification.js";

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

    await createActivity({
        type: "subscription_created",

        message:
            "A FarmConnect subscription was activated.",

        audience: "user",

        user: userId,
    });

    await sendNotification({

        receiver: userId,

        title:
            "Subscription Activated",

        message:
            "Your FarmConnect Premium subscription is now active.",

        type: "system",

        priority: "medium",

    });

    return await createSubscription({
        
        user: userId,
        plan,
        status: "active",
        gateway: "paystack",
        payment: paymentId,
        reference,
        startedAt,
        expiresAt,
    });

};

export const getUserSubscription = async (
    userId
) => {

    return await findActiveSubscriptionByUser(
        userId
    );

};