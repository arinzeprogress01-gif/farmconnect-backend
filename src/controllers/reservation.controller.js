import {

    reserveListing,

    cancelReservation,

    completeReservation,

    getTheVendorReservations,

    getTheUserReservations,

    getVendorReservationHistory,

    getUserReservationHistory,

    cancelUserReservation

} from "../services/reservations.service.js";

export const reserveFood = async (

    req,

    res,

    next

) => {

    try {

        const reservation =

            await reserveListing(

                req.user.id,

                req.body

            );

        res.status(201).json({

            success: true,

            message: "Food reserved successfully.",

            data: reservation,

        });

    } catch (error) {

        next(error);

    }

};

export const cancelMyReservation = async (

    req,

    res,

    next

) => {

    try {

        console.log("req.user:", req.user);

        const reservation =

            await cancelReservation(

                req.user.id,

                req.params.reservationId,

                req.body.cancellationReason

            );

        res.status(200).json({

            success: true,

            message: "Reservation cancelled successfully.",

            data: reservation,

        });

    } catch (error) {

        next(error);

    }

};


export const completeMyReservation = async (

    req,

    res,

    next

) => {

    try {

        const reservation =

            await completeReservation(

                req.user.id,

                req.params.reservationId

            );

        res.status(200).json({

            success: true,

            message: "Reservation completed successfully.",

            data: reservation,

        });

    } catch (error) {

        next(error);

    }

};


export const getVendorReservations = async (

    req,

    res,

    next

) => {

    try {

        const reservations =

            await getTheVendorReservations(

                req.user.id

            );

        res.status(200).json({

            success: true,

            count: reservations.length,

            data: reservations,

        });

    } catch (error) {

        next(error);

    }

};

export const getUserReservations = async (

    req,

    res,

    next

) => {

    try {

        const reservations =

            await getTheUserReservations(

                req.user.id

            );

        res.status(200).json({

            success: true,

            count: reservations.length,

            data: reservations,

        });

    } catch (error) {

        next(error);

    }

};

export const getVendorHistory = async (

    req,

    res,

    next

) => {

    try {

        const reservations =

            await getVendorReservationHistory(

                req.user.id

            );

        res.status(200).json({

            success: true,

            count: reservations.length,

            data: reservations,

        });

    } catch (error) {

        next(error);

    }

};

export const getUserHistory = async (

    req,

    res,

    next

) => {

    try {

        const reservations =

            await getUserReservationHistory(

                req.user.id

            );

        res.status(200).json({

            success: true,

            count: reservations.length,

            data: reservations,

        });

    } catch (error) {

        next(error);

    }

};

export const cancelReservationByUser = async (

    req,

    res,

    next

) => {

    try {

        const reservation =

            await cancelUserReservation(

                req.user._id,

                req.params.reservationId

            );

        res.status(200).json({

            success: true,

            message:

                "Reservation cancelled successfully.",

            data: reservation,

        });

    }

    catch (error) {

        next(error);

    }

};