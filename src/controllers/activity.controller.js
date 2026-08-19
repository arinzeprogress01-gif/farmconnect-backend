import {
    getVendorActivities,
    getUserActivities,
} from "../services/activity.service.js";

import { findVendorByUserId } from "../repositories/vendor.repository.js";

export const getVendorActivity = async (
    req,
    res,
    next
) => {
    try {
        const vendor = await findVendorByUserId(
            req.user.id
        );

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor profile not found.",
            });
        }

        const activities =
            await getVendorActivities(vendor._id);

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