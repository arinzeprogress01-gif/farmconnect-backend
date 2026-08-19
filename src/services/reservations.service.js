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
    getVendorReservationAnalytics,
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

    // Prevent a user from immediately reserving
    // a listing they recently cancelled.
    if (
        user.reservationRestriction?.listing &&
        user.reservationRestriction.listing.toString() ===
            listing._id.toString() &&
        user.reservationRestriction.blockedUntil > new Date()
    ) {

        const minutesLeft = Math.ceil(
            (
                user.reservationRestriction.blockedUntil -
                new Date()
            ) / (60 * 1000)
        );

        throw new BadRequestError(
            `You recently cancelled this listing. Please wait ${minutesLeft} minute(s) before reserving it again.`
        );
    }

    // Make sure the listing can still be reserved.
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

    await createActivity({
        type: "reservation_created",

        message:
            `${user.fullName} just reserved ${quantityRequested} ${quantityRequested === 1
                ? "meal"
                : "meals"
            } from ${listing.foodName}`,

        audience: "vendor",

        vendor: listing.vendorId,

        user: user._id,

        listing: listing._id,

        reservation: reservation._id,
    });

    // Reduce the remaining quantity.
    listing.quantity -= quantityRequested;

    // Track how many reservations have been made.
    listing.totalReservations += 1;

    // If everything has been reserved,
    // automatically complete the listing.
    if (listing.quantity <= 0) {
        listing.quantity = 0;
        listing.status = "pendingCompletion";
        listing.isActive = true;
    }

    await listing.save();

    /*
        Store Notification
        Push Notification
        Email Notification
    */

    // Notify vendor.
    await sendNotification({

        receiver:
            listing.vendorId,

        title:
            "New Reservation",

        message:
            `${user.fullName} reserved ${quantityRequested} portion(s) of ${listing.foodName}.`,

        type:
            "reservation",

        priority:
            "high",

        data: {

            reservationId:
                reservation.reservationId,

            listingId:
                listing.listingId,

            action:
                "OPEN_VENDOR_RESERVATIONS",

        },

    });

    // Notify user.
    await sendNotification({

        receiver:
            user._id,

        title:
            "Reservation Confirmed",

        message:
            `Your reservation for ${listing.foodName} was successful. Pickup Code: ${reservation.pickupCode}.`,

        type:
            "reservation",

        priority:
            "high",

        data: {

            reservationId:
                reservation.reservationId,

            action:
                "OPEN_MY_RESERVATIONS",

        },

    });

    // Notify vendor if the listing is now completely reserved.
    if (listing.quantity === 0) {

        await sendNotification({

            receiver: listing.vendorId,

            title: "Listing Fully Reserved",

            message:
                `${listing.foodName} has been fully reserved and is awaiting reservation completion.`,

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

    if (reservation.status !== "reserved") {

        throw new BadRequestError(
            "Only active reservations can be cancelled."
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

    // Re-open listing if necessary.
    if (
        listing.status === "pendingCompletion" ||
        listing.status === "fullReserved"
    ) {

        listing.status = "available";
        listing.isActive = true;

    }

    await listing.save();

    reservation.status = "cancelled";

    reservation.cancellationReason = cancellationReason;

    await updateReservation(reservation);

    await createActivity({
        type: "reservation_cancelled",

        message:
            `A reservation for ${reservation.foodName} was cancelled`,

        audience: "vendor",

        vendor: reservation.vendor,

        user: reservation.user,

        listing: reservation.listing,

        reservation: reservation._id,
    });

    await createActivity({
        type: "reservation_cancelled",

        message:
            `Your reservation for ${reservation.foodName} was cancelled`,

        audience: "user",

        vendor: reservation.vendor,

        user: reservation.user,

        listing: reservation.listing,

        reservation: reservation._id,
    });


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

    await createActivity({
        type: "reservation_completed",

        message:
            `A customer completed their pickup for ${reservation.foodName}`,

        audience: "vendor",

        vendor: reservation.vendor,

        user: reservation.user,

        listing: reservation.listing,

        reservation: reservation._id,
    });

    await createActivity({
        type: "reservation_completed",

        message:
            `You completed your pickup for ${reservation.foodName}`,

        audience: "user",

        vendor: reservation.vendor,

        user: reservation.user,

        listing: reservation.listing,

        reservation: reservation._id,
    });

    const listing = await findListingByObjectId(
        reservation.listing
    );

    if (!listing) {
        throw new NotFoundError(
            "Food listing not found."
        );
    }

    const pendingReservations = await Reservation.countDocuments({
        listing: listing._id,
        status: "reserved",
    });

    if (
        listing.quantity === 0 &&
        pendingReservations === 0
    ) {

        listing.status = "fullReserved";
        listing.isActive = false;

        await listing.save();

    }
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

    if (!listing) {
        throw new NotFoundError(
            "Food listing not found."
        );
    }

    listing.quantity +=
        reservation.quantityRequested;

    // Re-open listing if quantity becomes available again
    if (
        listing.quantity > 0
    ) {
        listing.status = "available";
        listing.isActive = true;
    }

    await listing.save();

    const updatedReservation =

        await cancelReservationByUser(

            reservationId,

            {

                status: "cancelled",

                cancelledBy: "user",

            }

        );

    const user = await User.findById(userId);

    if (!user) {
        throw new NotFoundError("User not found.");
    }

    user.reservationRestriction = {

        listing: reservation.listing,

        blockedUntil: new Date(
            Date.now() + (60 * 60 * 1000)
        ),

    };

    await user.save();
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

export const getTheVendorReservations = async (vendorId) => {

    const reservations = await Reservation.find({
        vendor: vendorId,
    })
        .populate("user", "fullName email phone")
        .populate(
            "listing",
            "listingId foodName category pickupLocation expiresAt imageUrls"
        )
        .sort({
            createdAt: -1,
        });

    return reservations.map((reservation) => {

        let timeRemaining = "Expired";

        if (
            reservation.status !== "expired" &&
            reservation.listing?.expiresAt
        ) {
            const diff =
                new Date(reservation.listing.expiresAt) - new Date();

            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor(
                    (diff % (1000 * 60 * 60)) / (1000 * 60)
                );

                timeRemaining = `${hours}h ${minutes}m`;
            }
        }

        return {
            ...reservation.toObject(),
            timeRemaining,
        };
    });

};

export const getTheUserReservations = async (userId) => {
    return Reservation.find({
        user: userId,
    })
        .populate(
            "listing",
            "foodName pickupLocation imageUrls"
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

export const updateListingReservationStatus = async (
    listingId
) => {

    const listing = await findListingByObjectId(listingId);

    if (!listing) {
        throw new NotFoundError(
            "Food listing not found."
        );
    }

    // If there is still available quantity,
    // the listing remains available.
    if (listing.quantity > 0) {

        listing.status = "available";
        listing.isActive = true;

        await listing.save();

        return listing;
    }

    // At this point quantity is completely allocated.
    listing.quantity = 0;

    // Check whether any reservation is still awaiting fulfilment.
    const pendingReservations =
        await Reservation.countDocuments({
            listing: listing._id,
            status: "reserved",
        });

    if (pendingReservations > 0) {

        listing.status = "pendingCompletion";
        listing.isActive = true;

    } else {

        // No active reservations remain.
        // Every reservation has either been completed
        // or cancelled, and there is no quantity left.
        listing.status = "fullReserved";
        listing.isActive = false;

    }

    await listing.save();

    return listing;
};


export const getVendorReservationAnalyticsService = async (
    vendorId
) => {

    const analytics =
        await getVendorReservationAnalytics(
            vendorId
        );

    return analytics;
};