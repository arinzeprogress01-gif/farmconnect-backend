import Activity from "../models/activity.model.js";

export const createActivity = async ({
    vendor = null,
    user = null,
    audience,
    type,
    message,
}) => {
    const activity = await Activity.create({
        vendor,
        user,
        audience,
        type,
        message,
    });

    return activity;
};



export const getVendorActivities = async (vendorId) => {

    const activities = await Activity.find({
        vendor: vendorId,
        audience: {
            $in: ["vendor", "both"],
        },
    })
        .sort({
            createdAt: -1,
        })
        .limit(10)
        .lean();

    return activities;
};

export const getUserActivities = async (userId) => {

    const activities = await Activity.find({
        audience: {
            $in: ["user", "both"],
        },

        $or: [
            {
                user: userId,
            },
            {
                user: null,
            },
        ],
    })
        .sort({
            createdAt: -1,
        })
        .limit(10)
        .lean();

    return activities;
};


