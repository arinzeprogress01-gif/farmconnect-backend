import Subscription from "../models/subscription.model.js";

export const createSubscription = async (
    subscriptionData
) => {

    return await Subscription.create(
        subscriptionData
    );

};

export const findActiveSubscriptionByUser = async (
    userId
) => {

    return await Subscription.findOne({
        user: userId,
        status: "active",
    })
        .sort({
            expiresAt: -1,
        })
        .lean();

};

export const findSubscriptionByReference = async (
    reference
) => {

    return await Subscription.findOne({
        reference,
    });

};

export const updateSubscription = async (
    subscriptionId,
    updateData
) => {

    return await Subscription.findByIdAndUpdate(
        subscriptionId,
        {
            $set: updateData,
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

};