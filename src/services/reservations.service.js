import Reservation from "../models/reservation.model.js";
import User from "../models/user.models.js";

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

    // Vendor Ownership

    if (

        reservation.vendor.toString() !==

        vendorId.toString()

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

    }

    await listing.save();

    reservation.status = "cancelled";

    reservation.cancellationReason = cancellationReason;

    await updateReservation(reservation);

    /*

        Store Notification

        Push Notification

        Email Notification

    */

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

    if (

        reservation.vendor.toString() !==

        vendorId.toString()

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

    return reservation;

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