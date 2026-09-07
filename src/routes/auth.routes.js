import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
} from "../controllers/auth.controller.js";

import {

    forgotPasswordUser,

    verifyUserOtp,

    resetUserPassword,

} from "../controllers/auth.controller.js";

import { validate} from "../middleware/validate.middleware.js";

import {
    registerSchema,
    loginSchema,
} from "../validators/auth.validator.js";

import {
    registerRateLimiter,
    loginRateLimiter,
    forgotPasswordRateLimiter,
    verifyOtpRateLimiter,
    resetPasswordRateLimiter,
} from "../utils/ipRateLimiters.js";
import getNotificationQueue from "../queues/notification.queue.js";;


const router = express.Router();

router.post("/test-notification-job", async (req, res) => {
    const notificationQueue = getNotificationQueue();
    const job = await notificationQueue.add("test-notification", {
        message: "FarmConnect BullMQ test",
        createdAt: new Date().toISOString(),
    });

    res.status(202).json({
        success: true,
        message: "Notification job queued successfully.",
        jobId: job.id,
    });
});

router.post(
    "/register",
    validate(registerSchema),
    registerRateLimiter,
    registerUser
);


router.post(
    "/login",
    validate(loginSchema),
    loginRateLimiter,
    loginUser
);

router.get(
    "/me",
    authenticate,
    getCurrentUser
);

router.post(

    "/forgot-password",

    forgotPasswordRateLimiter,

    forgotPasswordUser

);

router.post(

    "/verify-otp",

    verifyOtpRateLimiter,

    verifyUserOtp

);

router.post(

    "/reset-password",

    resetPasswordRateLimiter,


    resetUserPassword

);

router.post(
    "/logout",
    authenticate,
    logoutUser
);

export default router;
