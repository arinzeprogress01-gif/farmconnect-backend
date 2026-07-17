import {
    getVendorAnalytics,
} from "../repositories/analytics.repository.js";

import {
    findVendorByUserId,
} from "../repositories/listing.repository.js";

import NotFoundError from "../errors/NotFoundError.js";

export const getDashboardAnalytics = async (
    userId
) => {

    const vendor =
        await findVendorByUserId(
            userId
        );

    if (!vendor) {

        throw new NotFoundError(
            "Vendor profile not found."
        );

    }

    return await getVendorAnalytics(
        vendor._id
    );

};