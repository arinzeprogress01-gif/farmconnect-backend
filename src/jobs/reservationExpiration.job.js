import cron from "node-cron";

import {
    findExpiredReservations,
    updateReservation,
} from "../repositories/reservation.repository.js";

import {
    findListingByObjectId,
} from "../repositories/listing.repository.js";

import sendNotification from "../utils/sendNotification.js";

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
                if (
                    listing.status === "completed"
                ) {

                    listing.status = "available";
                    listing.isActive = true;

                }

                await listing.save();

                reservation.status = "expired";

                await updateReservation(
                    reservation
                );

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