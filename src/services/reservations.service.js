import Reservation from "../models/reservation.model.js";
import User from "../models/user.models.js";
import sendNotification from "../utils/sendNotification.js";
import { findVendorByUserId } from "../repositories/listing.repository.js";

import {

    cancelReservationByUser,

} from "../repositories/reservation.repository.js";

import { findUserById } from "../repositories/user.repository.js";

import reservationSchema from "../validators/reservation.validator.js";

import {
    createReservation,
    findReservationById,
    findReservationByReservationId,
    getVendorReservations,
    getUserReservations,
    updateReservation,
    deleteReservation,
} from "../repositories/reservation.repository.js";

import {
    findListingById,
    findListingByObjectId,
} from "../repositories/listing.repository.js";

import generateReservationId from "../utils/generateReservationId.js";
import generatePickupCode from "../utils/generatePickupCode.js";

import BadRequestError from "../errors/BadRequestError.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import NotFoundError from "../errors/NotFoundError.js";



export const reserveListing = async (
    userId,
    reservationData
) => {

    const { error, value } =
        reservationSchema.validate(
            reservationData
        );

    if (error) {

        throw new BadRequestError(
            error.details[0].message
        );

    }

    const {
        listingId,
        quantityRequested,
    } = value;

    const user =
        await User.findById(userId);

    if (!user) {

        throw new NotFoundError(
            "User not found."
        );

    };

    if (

        user.reservationBlockedUntil &&

        user.reservationBlockedUntil >

        new Date()

    ) {

        const minutesLeft = Math.ceil(

            (

                user.reservationBlockedUntil -

                new Date()

            )

            /

            (60 * 1000)

        );

        throw new BadRequestError(

            `You cancelled a reservation recently. Please wait ${minutesLeft} minute(s) before making another reservation.`

        );

    }

    const listing =
        await findListingById(
            listingId
        );

    if (!listing) {

        throw new NotFoundError(
            "Food listing not found."
        );

    }

    if (
        listing.status !== "available" ||
        !listing.isActive
    ) {

        throw new BadRequestError(
            "This food listing is no longer available."
        );

    }

    if (
        quantityRequested >
        listing.quantity
    ) {

        throw new BadRequestError(
            "Requested quantity exceeds available quantity."
        );

    }

    const reservation = await createReservation({

        reservationId:
            generateReservationId(),

        pickupCode:
            generatePickupCode(),

        listing:
            listing._id,

        vendor:
            listing.vendorId,

        user:
            user._id,

        foodName:
            listing.foodName,

        category:
            listing.category,

        pickupLocation:
            listing.pickupLocation,

        quantityRequested,

        status: "reserved",

    });

    listing.quantity -= quantityRequested;

    listing.totalReservations += 1;

    if (listing.quantity <= 0) {

        listing.quantity = 0;

        listing.status = "completed";

        listing.isActive = false;

    }

    await listing.save();

    /*
        Store Notification

        Push Notification

        Email Notification
    */
    
    await sendNotification({

    receiver: listing.vendorId,

    title: "New Reservation",

    message:
        `${user.fullName} reserved ${quantityRequested} portion(s) of ${listing.foodName}.`,

    type: "reservation",

    priority: "high",

    data: {

        reservationId:
            reservation.reservationId,

        listingId:
            listing.listingId,

        action:
            "OPEN_VENDOR_RESERVATIONS",

    },

});

    await sendNotification({

        receiver: user._id,

        title: "Reservation Confirmed",

        message:
            `Your reservation for ${listing.foodName} was successful. Pickup Code: ${reservation.pickupCode}.`,

        type: "reservation",

        priority: "high",

        data: {

            reservationId:
                reservation.reservationId,

            action:
                "OPEN_MY_RESERVATIONS",

        },

    });

    if (listing.quantity === 0) {

        await sendNotification({

            receiver: listing.vendorId,

            title: "Listing Completed",

            message:
                `${listing.foodName} has been completely reserved.`,

            type: "listing",

            priority: "medium",

            data: {

                listingId:
                    listing.listingId,

                action:
                    "OPEN_MY_LISTINGS",

            },

        });

    }

    return reservation;

};

export const cancelReservation = async (

    vendorId,

    reservationId,

    cancellationReason

) => {

    if (!cancellationReason?.trim()) {

        throw new BadRequestError(

            "Cancellation reason is required."

        );

    }

    const reservation = await findReservationById(

        reservationId

    );

    if (!reservation) {

        throw new NotFoundError(

            "Reservation not found."

        );

    }

    const vendorProfile = await findVendorByUserId(vendorId);

    if (!vendorProfile) {
        throw new NotFoundError("Vendor profile not found.");
    }

    if (
        reservation.vendor.toString() !==
        vendorProfile._id.toString()
    ) {
        throw new ForbiddenError(
            "You are not allowed to cancel this reservation."
        );
    }

    if (

        reservation.status === "completed"

    ) {

        throw new BadRequestError(

            "Completed reservations cannot be cancelled."

        );

    }

    if (

        reservation.status === "cancelled"

    ) {

        throw new BadRequestError(

            "Reservation has already been cancelled."

        );

    }

    const listing = await findListingByObjectId(

        reservation.listing

    );

    if (!listing) {

        throw new NotFoundError(

            "Food listing not found."

        );

    }

    // Restore Quantity

    listing.quantity +=

        reservation.quantityRequested;

    // Re-open listing if necessary

    if (

        listing.status === "completed"

    ) {

        listing.status = "available";

        listing.isActive = true;

    };

    await listing.save();

    reservation.status = "cancelled";

    reservation.cancellationReason = cancellationReason;

    await updateReservation(reservation);

    const user = await findUserById(reservation.user);

    if (!user) {
        throw new NotFoundError("User not found.");
    }

    console.log("Before:", user.reservationBlockedUntil);

    user.reservationBlockedUntil = new Date(
        Date.now() + (60 * 60 * 1000)
    );

    console.log("Modified?", user.isModified("reservationBlockedUntil"));
    console.log("After Assignment:", user.reservationBlockedUntil);

    await user.save();

    const updatedUser = await findUserById(reservation.user);

    console.log("After Save:", updatedUser.reservationBlockedUntil);

    console.log(
        "Saved blockedUntil:",
        user.reservationBlockedUntil
    );

    /*

        Store Notification

        Push Notification

        Email Notification

    */

    await sendNotification({

        receiver: reservation.user,

        title: "Reservation Cancelled",

        message:
            `Your reservation for ${reservation.foodName} was cancelled.

Reason: ${cancellationReason}`,

        type: "reservation",

        priority: "high",

        data: {

            reservationId:
                reservation.reservationId,

            action:
                "OPEN_MY_RESERVATIONS",

        },

    });

    return reservation;

};

export const completeReservation = async (

    vendorId,

    reservationId

) => {

    const reservation =

        await findReservationById(

            reservationId

        );

    if (!reservation) {

        throw new NotFoundError(

            "Reservation not found."

        );

    }

    const vendorProfile = await findVendorByUserId(vendorId);

    if (!vendorProfile) {
        throw new NotFoundError("Vendor profile not found.");
    }

    if (
        reservation.vendor.toString() !==
        vendorProfile._id.toString()
    ) {
        throw new ForbiddenError(
            "You are not allowed to complete this reservation."
        );
    }

    if (

        reservation.status === "completed"

    ) {

        throw new BadRequestError(

            "Reservation has already been completed."

        );

    }

    if (

        reservation.status === "cancelled"

    ) {

        throw new BadRequestError(

            "Cancelled reservations cannot be completed."

        );

    }

    reservation.status = "completed";

    reservation.completedAt = new Date();

    await updateReservation(reservation);

    /*

        Store Notification

        Push Notification

        Email Notification

    */
    await sendNotification({

        receiver: reservation.user,

        title: "Reservation Completed",

        message:
            `Your reservation for ${reservation.foodName} has been marked as completed.`,

        type: "reservation",

        priority: "medium",

        data: {

            reservationId:
                reservation.reservationId,

            action:
                "OPEN_MY_RESERVATIONS",

        },

    });

    return reservation;

};

export const cancelUserReservation = async (

    userId,

    reservationId

) => {

    const reservation =

        await findReservationById(

            reservationId

        );

    if (!reservation) {

        throw new AppError(

            "Reservation not found.",

            404

        );

    }

    if (

        reservation.user.toString()

        !==

        userId.toString()

    ) {

        throw new ForbiddenError(

            "You can only cancel your own reservation."

        );

    }

    if (

        reservation.status !== "reserved"

    ) {

        throw new BadRequestError(

            "Only active reservations can be cancelled."

        );

    }

    const listing =

    await findListingByObjectId(

        reservation.listing

    );

    listing.quantity +=

        reservation.quantityRequested;

    await listing.save();

    const updatedReservation =

        await cancelReservationByUser(

            reservationId,

            {

                status: "cancelled",

                cancelledBy: "user",

            }

        );

    // Vendor notification

    await sendNotification({

        receiver: listing.vendorId,

        title: "Reservation Cancelled",

        message:
            "A user cancelled their reservation.",

        type: "reservation",

        priority: "medium",

        data: {

            reservationId,

        },

    });

    // User notification

    await sendNotification({

        receiver: userId,

        title: "Reservation Cancelled",

        message:
            "Your reservation has been cancelled successfully.",

        type: "reservation",

        priority: "medium",

        data: {

            reservationId,

        },

    });

    return updatedReservation;

};

export const getTheVendorReservations = async (

    vendorId

) => {

    return Reservation.find({

        vendor: vendorId,

    })

        .populate("user", "fullName email phone")

        .populate(

            "listing",

            "foodName pickupLocation"

        )

        .sort({

            createdAt: -1,

        });

};

export const getTheUserReservations = async (

    userId

) => {

    return Reservation.find({

        user: userId,

    })

        .populate(

            "listing",

            "foodName pickupLocation"

        )

        .populate(

            "vendor",

            "businessName"

        )

        .sort({

            createdAt: -1,

        });

};

export const getVendorReservationHistory = async (

    vendorId

) => {

    return await getVendorReservations(

        vendorId

    );

};

export const getUserReservationHistory = async (

    userId

) => {

    return await getUserReservations(

        userId

    );

};