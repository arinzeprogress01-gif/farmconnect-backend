import Activity from "../models/activity.model.js";
import {
    emitToUser
} from "../sockets/socket.events.js";
import VendorProfile from "../models/vendor.model.js";


export const createActivity = async ({
    vendor = null,
    user = null,
    listing = null,
    reservation = null,
    audience,
    type,
    message,
}) => {

    const activity = await Activity.create({
        vendor,
        user,
        listing,
        reservation,
        audience,
        type,
        message,
    });

    emitToUser(
        user,
        "activity:new",
        activity
    );

    emitToUser(
        vendor,
        "activity:new",
        activity
    );

    return activity;
};


const getTwentyFourHoursAgo = () => {

    return new Date(
        Date.now() - 24 * 60 * 60 * 1000
    );

};


export const getVendorActivities = async (userId) => {

    const vendor = await VendorProfile.findOne({
        userId,
    });

    if (!vendor) {
        return [];
    }

    const activities = await Activity.find({

        audience: {
            $in: ["vendor", "both"],
        },

        vendor: vendor._id,

        createdAt: {
            $gte: getTwentyFourHoursAgo(),
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

        createdAt: {
            $gte: getTwentyFourHoursAgo(),
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