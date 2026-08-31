import {
    createPayment,
    findPaymentByReference,
    updatePaymentStatus,
    findPaymentsByUser,
} from "../repositories/payment.repository.js";


export const processSuccessfulPayment = async ({
    reference,
    amount,
    currency,
    channel,
    metadata,
    paidAt,
    user,
}) => {

    const existingPayment =
        await findPaymentByReference(reference);


    // Already successfully processed
    if (
        existingPayment &&
        existingPayment.status === "success"
    ) {

        console.log(
            `Payment ${reference} already processed.`
        );

        return {
            payment: existingPayment,
            isNewPayment: false,
        };
    }


    // Payment exists but wasn't successful
    if (existingPayment) {

        const payment =
            await updatePaymentStatus(
                reference,
                {
                    status: "success",
                    amount,
                    currency,
                    channel,
                    metadata,
                    paidAt,
                    user,
                }    
            );

        return {
            payment,
            isNewPayment: true,
        };
    }


    // Completely new payment
    const payment = await createPayment({

        reference,
        amount,
        currency,
        channel,
        metadata,
        paidAt,

        user,
        status: "success",

        gateway: "paystack",
    });

    return {
        payment,
        isNewPayment: true,
    };
};

export const initializePaystackPayment = async ({
    email,
    amount,
    userId,
}) => {

    const response = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
            method: "POST",

            headers: {
                Authorization:
                    `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                email,
                amount,
                currency: "NGN",

                metadata: {
                    userId,
                },
            }),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.status) {
        throw new Error(
            result.message ||
            "Failed to initialize Paystack transaction."
        );
    }

    return result.data;
};

export const getPaymentHistory = async (userId) => {

    return await findPaymentsByUser(userId);

};