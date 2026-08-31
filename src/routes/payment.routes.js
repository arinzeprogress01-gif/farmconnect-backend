import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
    initializePayment,
    getMyPaymentHistory,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post(
    "/initialize",
    authenticate,
    initializePayment
);

router.get(
    "/history",
    authenticate,
    getMyPaymentHistory
);

export default router;