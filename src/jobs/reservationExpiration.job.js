import cron from "node-cron";
import VendorProfile from "../models/vendor.model.js";
import { createActivity } from "../services/activity.service.js";
import {
    findExpiredReservations,
    updateReservation,
} from "../repositories/reservation.repository.js";

import {
    findListingByObjectId,
} from "../repositories/listing.repository.js";

import sendNotification from "../utils/sendNotification.js";
import {invalidateMarketListingsCache} from "../utils/cacheInvalidation.js";

export const startReservationExpirationJob = () => {

    cron.schedule("* * * * *", async () => {

        try {

            const expiredReservations =
                await findExpiredReservations();

            for (const reservation of expiredReservations) {

                const listing =
                    await findListingByObjectId(
                        reservation.listing
                    );

                if (!listing) {
                    continue;
                }

                // Restore quantity
                listing.quantity +=
                    reservation.quantityRequested;

                // Reopen listing if it was completed
                // Reopen listing if the expired reservation
                // releases quantity back into the listing.
                if (
                    listing.quantity > 0
                ) {

                    listing.status = "available";

                    listing.isActive = true;

                }
                await listing.save();
                await invalidateMarketListingsCache();

                reservation.status = "expired";

                await updateReservation(
                    reservation
                );

                await createActivity({
    type: "reservation_expired",
    message:
        `Your reservation for ${reservation.foodName} has expired.`,
    audience: "user",
    vendor: reservation.vendor,
    user: reservation.user,
    listing: reservation.listing,
    reservation: reservation._id,
});

await createActivity({
    type: "reservation_expired",
    message:
        `A reservation for ${reservation.foodName} has expired and the quantity has been restored.`,
    audience: "vendor",
    vendor: reservation.vendor,
    user: reservation.user,
    listing: reservation.listing,
    reservation: reservation._id,
});

                // Notify User
                await sendNotification({

                    receiver:
                        reservation.user,

                    title:
                        "Reservation Expired",

                    message:
                        `Your reservation for ${reservation.foodName} has expired.`,

                    type:
                        "reservation",

                    priority:
                        "medium",

                    data: {

                        reservationId:
                            reservation.reservationId,

                    },

                });

                // Notify Vendor
                const vendor = await VendorProfile.findById(
                    listing.vendorId
                );

                await sendNotification({

                    receiver: vendor.userId,

                    title: "Reservation Expired",

                    message: `Reservation for ${reservation.foodName} expired. Quantity has been restored.`,

                    type: "reservation",

                    priority: "medium",

                    data: {

                        reservationId: reservation.reservationId,

                    },

                });

            }

        } catch (error) {

            console.error(
                "Reservation Scheduler Error:",
                error.message
            );

        }

    });

};