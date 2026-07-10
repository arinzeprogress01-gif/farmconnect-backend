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
 *     description: Creates a new FarmConnect account for either a user or vendor.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phone
 *               - password
 *               - confirmPassword
 *               - role
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Higgs Progress
 *               email:
 *                 type: string
 *                 example: higgs@gmail.com
 *               phone:
 *                 type: string
 *                 example: 08012345678
 *               password:
 *                 type: string
 *                 example: Password123
 *               confirmPassword:
 *                 type: string
 *                 example: Password123
 *               role:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - vendor
 *                 example: user
 *     responses:
 *       201:
 *         description: Registration successful.
 *       400:
 *         description: Validation failed.
 *       409:
 *         description: Email already exists.
 */

router.post(
    "/register",
    validate(registerSchema),
    registerUser
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates an existing FarmConnect user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: higgs@gmail.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid email or password.
 */

router.post(
    "/login",
    validate(loginSchema),
    loginUser
);

export default router;