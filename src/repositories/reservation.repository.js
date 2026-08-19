import Reservation from "../models/reservation.model.js";
import { RESERVATION_EXPIRY_MINUTES } from "../constants/reservation.js";

export const createReservation = async (reservationData) => {

    return Reservation.create(reservationData);

};

export const findReservationById = async (reservationId) => {

    return Reservation.findOne({

        reservationId,

    });

};

export const findReservationByReservationId = async (reservationId) => {

    return Reservation.findOne({

        reservationId,

    });

};


export const findExpiredReservations = async () => {

    return Reservation.find({

        status: "reserved",

        reservedAt: {

            $lte: new Date(

                Date.now() -

                RESERVATION_EXPIRY_MINUTES * 60 * 1000

            ),

        },

    });

};

export const getVendorReservations = async (vendorId) => {

    return Reservation.find({
        vendor: vendorId,
    })
        .populate(
            "user",
            "fullName email phone"
        )
        .populate(
            "listing",
            "listingId foodName category pickupLocation expiresAt"
        )
        .sort({
            createdAt: -1,
        })
        .lean();

};

export const getUserReservations = async (userId) => {
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

export const updateReservation = async (reservation) => {

    return reservation.save();

};

export const deleteReservation = async (reservationId) => {

    return Reservation.findByIdAndDelete(reservationId);

};

export const cancelReservationByUser = async (

    reservationId,

    updateData

) => {

    return await Reservation.findOneAndUpdate(

        {

            reservationId,

        },

        updateData,

        {

            returnDocument: "after",
            
        }

    );

};


export const getVendorReservationAnalytics = async (vendorId) => {

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const reservations = await Reservation.find({
        vendor: vendorId,
        reservedAt: {
            $gte: startOfToday,
            $lte: endOfToday,
        },
    }).lean();

    return {
        totalToday: reservations.length,

        active: reservations.filter(
            (reservation) =>
                reservation.status === "reserved"
        ).length,

        completed: reservations.filter(
            (reservation) =>
                reservation.status === "completed"
        ).length,

        expired: reservations.filter(
            (reservation) =>
                reservation.status === "expired"
        ).length,

        cancelled: reservations.filter(
            (reservation) =>
                reservation.status === "cancelled"
        ).length,
    };
};