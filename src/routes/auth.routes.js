import express from "express";

import {
    registerUser,
    loginUser,
    forgotPassword,
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

export default router;