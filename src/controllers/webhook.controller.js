import crypto from "crypto";
import { handlePaystackEvent } from "../services/paystackWebhook.service.js";


export const handlePaystackWebhook = async (
    req,
    res,
    next
) => {
    try {
        const signature =
            req.headers["x-paystack-signature"];

        if (!signature) {
            return res.status(401).json({
                success: false,
                message:
                    "Missing Paystack signature.",
            });
        }

        const secret =
            process.env.PAYSTACK_SECRET_KEY;

        if (!secret) {
            throw new Error(
                "PAYSTACK_SECRET_KEY is not configured."
            );
        }

        const receivedSignature =
            Buffer.from(signature, "hex");

        const calculatedSignature =
            crypto
                .createHmac("sha512", secret)
                .update(req.rawBody)
                .digest();

        

        const isValid =
            receivedSignature.length ===
            calculatedSignature.length &&
            crypto.timingSafeEqual(
                calculatedSignature,
                receivedSignature
            );

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid Paystack signature.",
            });
        }

        console.log(
            "✅ Paystack webhook verified."
        );

        const event = req.body.event;
        const data = req.body.data;

        await handlePaystackEvent(event, data);

        console.log(
            "Received Paystack webhook event:",
            event
        );

        return res.status(200).json({
            success: true,
            message:
                "Webhook received successfully.", event: event,
        });

    } catch (error) {
        next(error);
    }
};





