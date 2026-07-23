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

        .populate("user", "fullName email phone")

        .sort({

            createdAt: -1,

        });

};

export const getUserReservations = async (userId) => {

    return Reservation.find({

        user: userId,

    })

        .populate("vendor", "businessName")

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

            new: true,

        }

    );

};