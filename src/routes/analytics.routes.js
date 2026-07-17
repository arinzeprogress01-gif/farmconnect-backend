import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import vendorOnly from "../middleware/vendor.middleware.js";

import {
    dashboardAnalytics,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get(

    "/dashboard",

    authenticate,

    vendorOnly,

    dashboardAnalytics

);

export default router;