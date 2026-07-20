import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import vendorOnly from "../middleware/vendor.middleware.js";

import userOnly from "../middleware/userOnly.middleware.js";

import {

    reserveFood,

    cancelMyReservation,

    completeMyReservation,

    getVendorReservations,

    getUserReservations,

    getVendorHistory,

    getUserHistory,

} from "../controllers/reservation.controller.js";

const router = express.Router();

router.post(

    "/",

    authenticate,

    userOnly,

    reserveFood

);

router.get(

    "/my-reservations",

    authenticate,

    userOnly,

    getUserReservations

);

router.get(

    "/my-history",

    authenticate,

    userOnly,

    getUserHistory

);

router.get(

    "/vendor",

    authenticate,

    vendorOnly,

    getVendorReservations

);

router.get(

    "/vendor/history",

    authenticate,

    vendorOnly,

    getVendorHistory

);

router.patch(
    "/:reservationId/complete",

    authenticate,

    vendorOnly,

    completeMyReservation

);

router.patch(

    "/:reservationId/cancel",

    authenticate,

    vendorOnly,

    cancelMyReservation

);

export default router;