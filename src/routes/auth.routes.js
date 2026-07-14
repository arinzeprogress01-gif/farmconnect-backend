import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
    registerUser,
    loginUser,
    logoutUser
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
    forgotPasswordSchema,
} from "../validators/auth.validator.js";

const router = express.Router();


router.post(
    "/register",
    validate(registerSchema),
    registerUser
);


router.post(
    "/login",
    validate(loginSchema),
    loginUser
);


router.post(

    "/forgot-password",

    forgotPasswordUser

);

router.post(

    "/verify-otp",

    verifyUserOtp

);

router.post(

    "/reset-password",

    resetUserPassword

);

router.post(
    "/logout",
    authenticate,
    logoutUser
);

export default router;