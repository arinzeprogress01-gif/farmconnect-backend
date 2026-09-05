import cron from "node-cron";
import VendorProfile from "../models/vendor.model.js";
import { createActivity } from "../services/activity.service.js";
import Listing from "../models/listing.model.js";
import { invalidateMarketListingsCache } from "../utils/cacheInvalidation.js";

import {
    createNotification,
} from "../repositories/notification.repository.js";

export const startListingExpirationJob = () => {

    cron.schedule(

        "* * * * *",

        async () => {

            const expiredListings = await Listing.find({

                status: {
                    $in: [
                        "available",
                        "pendingCompletion",
                    ],
                },

                isActive: true,

                expiresAt: {

                    $lte: new Date(),

                },

            });

            for (const listing of expiredListings) {

                listing.status = "expired";

                listing.isActive = false;

                await listing.save();
                await invalidateMarketListingsCache();

                await createActivity({
                    type: "listing_expired",
                    message:
                        `${listing.foodName} has expired and is no longer available.`,
                    audience: "vendor",
                    vendor: listing.vendorId,
                    listing: listing._id,
                });

                const vendor = await VendorProfile.findById(
                    listing.vendorId
                );

                try {

                    await createNotification({

                        receiver: vendor.userId,

                        title: "Listing Expired",

                        message:
                            `${listing.foodName} has expired and is no longer visible in the marketplace.`,

                        type: "listing_expired",

                        priority: "medium",

                        data: {

                            listingId: listing.listingId,

                        },

                    });

                } catch (error) {

                    console.error(error);

                };

            }

        }

    );

    // Schedule a cleanup job to run every day at midnight.
    // This permanently removes listings that have already
    // been marked as expired by the expiration job.

    cron.schedule(

        "0 0 * * *",

        async () => {

            console.log(
                "🔄 Running automated background task: Cleaning up expired listings..."
            );

            try {

                const result = await Listing.deleteMany({
                    status: "expired",
                });

                console.log(
                    `✅ Cleaned up successfully. Total deleted records: ${result.deletedCount}`
                );

            } catch (error) {

                console.error(
                    "❌ Error executing expired listings cleanup cron job:",
                    error
                );

            }

        },

        {
            timezone: "Africa/Lagos",
        }

    );

};