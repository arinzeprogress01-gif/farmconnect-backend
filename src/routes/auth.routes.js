import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
    registerUser,
    loginUser,
    forgotPassword,
    logoutUser
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

    validate(forgotPasswordSchema),

    forgotPassword

);

router.post(
    "/logout",
    authenticate,
    logoutUser
);

export default router;