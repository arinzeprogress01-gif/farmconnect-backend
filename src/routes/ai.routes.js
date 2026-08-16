import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import userOnly from "../middleware/userOnly.middleware.js";

import {
    askAI,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.post(
    "/chat",
    authenticate,
    userOnly,
    askAI
);

export default router;