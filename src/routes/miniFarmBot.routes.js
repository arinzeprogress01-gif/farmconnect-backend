import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
    miniFarmBot,
} from "../controllers/miniFarmBot.controller.js";

const router =
    express.Router();

router.post(

    "/chat",

    authenticate,

    miniFarmBot

);

export default router;