import cron from "node-cron";
import VendorProfile from "../models/vendor.model.js";

import Listing from "../models/listing.model.js";

import {
    createNotification,
} from "../repositories/notification.repository.js";

export const startListingExpirationJob = () => {

    cron.schedule(

        "* * * * *",

        async () => {

            const expiredListings = await Listing.find({

                status: "available",

                isActive: true,

                expiresAt: {

                    $lte: new Date(),

                },

            });

            for (const listing of expiredListings) {

                listing.status = "expired";

                listing.isActive = false;

                await listing.save();

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

};