import {
    initializePaystackPayment,
} from "../services/payment.service.js";


export const initializePayment = async (
    req,
    res,
    next
) => {

    try {

        const {
            email,
            amount,
        } = req.body;

        const payment =
            await initializePaystackPayment({
                email,
                amount,
                userId: req.user._id,
            });

        return res.status(200).json({
            success: true,
            message:
                "Payment initialized successfully.",

            data: payment,
        });

    } catch (error) {
        next(error);
    }
};