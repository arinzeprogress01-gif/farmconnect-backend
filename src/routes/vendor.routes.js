import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import vendorOnly from "../middleware/vendor.middleware.js";

import {
    createVendorProfile,
    getVendorProfile,
    updateVendorProfile,
    deleteVendorProfile
} from "../controllers/vendor.controller.js";

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

router.patch(

    "/profile",

    authenticate,

    vendorOnly,

    updateVendorProfile

);

router.delete(

    "/profile",

    authenticate,

    vendorOnly,

    deleteVendorProfile

);

export default router;