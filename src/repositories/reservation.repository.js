import Reservation from "../models/reservation.model.js";

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