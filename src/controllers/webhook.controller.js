import crypto from "crypto";

export const handlePaystackWebhook = async (req, res, next) => {
    try {
        const signature = req.headers["x-paystack-signature"];

        if (!signature) {
            return res.status(401).json({
                success: false,
                message: "Missing Paystack signature.",
            });
        }

        const secret = process.env.PAYSTACK_SECRET_KEY;

        if (!secret) {
            throw new Error(
                "PAYSTACK_SECRET_KEY is not configured."
            );
        }

        const hash = crypto
            .createHmac("sha512", secret)
            .update(req.rawBody)
            .digest("hex");

        const isValid = crypto.timingSafeEqual(
            Buffer.from(hash),
            Buffer.from(signature)
        );

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid Paystack signature.",
            });
        }

        console.log("✅ Paystack webhook verified.");

        console.log("Event:", req.body.event);

        return res.status(200).json({
            success: true,
            message: "Webhook received successfully.",
        });

    } catch (error) {
        next(error);
    }
};