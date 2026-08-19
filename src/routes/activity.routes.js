import express from "express";

import {
    getVendorActivity,
    getUserActivity,
} from "../controllers/activity.controller.js";

import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
    "/vendor",
    authenticate,
    getVendorActivity
);

router.get(
    "/user",
    authenticate,
    getUserActivity
);

export default router;