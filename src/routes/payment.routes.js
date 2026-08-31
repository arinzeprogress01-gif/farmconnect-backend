import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
    initializePayment,
} from "../controllers/payment.controller.js";


const router = express.Router();


router.post(
    "/initialize",
    authenticate,
    initializePayment
);


export default router;