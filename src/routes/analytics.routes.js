import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import vendorOnly from "../middleware/vendor.middleware.js";

import userOnly from "../middleware/userOnly.middleware.js"

import {
    dashboardAnalytics,
    userDashboardAnalytics
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get(

    "/dashboard",

    authenticate,

    vendorOnly,

    dashboardAnalytics

);

router.get(

    "/user-dashboard",

    authenticate,

    userOnly,

    userDashboardAnalytics

);

export default router;