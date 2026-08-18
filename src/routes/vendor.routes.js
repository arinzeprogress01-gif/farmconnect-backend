import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import vendorOnly from "../middleware/vendor.middleware.js";

import {
    createVendorProfile,
    getVendorProfile,
    updateVendorProfile,
    deleteVendorProfile,
    updateVendorCurrentLocation,
} from "../controllers/vendor.controller.js";

import {getVendorReservationAnalytics} from "../controllers/reservation.controller.js"

const router = express.Router();

router.post(

    "/profile",

    authenticate,

    vendorOnly,

    createVendorProfile

);

router.get(

    "/profile",

    authenticate,

    vendorOnly,

    getVendorProfile

);


router.get(
    "/vendor/analytics",
    authenticate,
    vendorOnly,
    getVendorReservationAnalytics
);

router.patch(

    "/profile",

    authenticate,

    vendorOnly,

    updateVendorProfile

);

router.patch(
    "/location",
    authenticate,
    vendorOnly,
    updateVendorCurrentLocation
);

router.delete(

    "/profile",

    authenticate,

    vendorOnly,

    deleteVendorProfile

);

export default router;