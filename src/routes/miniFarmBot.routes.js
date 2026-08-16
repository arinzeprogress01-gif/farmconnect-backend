import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import userOnly from "../middleware/userOnly.middleware.js";

import {
    miniFarmBot,
} from "../controllers/miniFarmBot.controller.js";

const router =
    express.Router();

router.post(

    "/chat",

    authenticate,

    userOnly,

    miniFarmBot

);

export default router;