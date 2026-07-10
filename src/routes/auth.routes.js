import express from "express";

import {
    registerUser,
    loginUser
} from "../controllers/auth.controller.js";

import { validate} from "../middleware/validate.middleware.js";

import {
    registerSchema,
    loginSchema
} from "../validators/auth.validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Registration successful
 */

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

export default router;