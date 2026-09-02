import {
    getVendorActivities,
    getUserActivities,
} from "../services/activity.service.js";


export const getVendorActivity = async (
    req,
    res,
    next
) => {

    try {

        const activities =
            await getVendorActivities(req.user.id);

        res.status(200).json({
            success: true,
            data: activities,
        });

    } catch (error) {

        next(error);

    }

};


export const getUserActivity = async (
    req,
    res,
    next
) => {

    try {

        const activities =
            await getUserActivities(req.user.id);

        res.status(200).json({
            success: true,
            data: activities,
        });

    } catch (error) {

        next(error);

    }

};