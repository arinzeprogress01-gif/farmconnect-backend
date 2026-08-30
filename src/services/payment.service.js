import {
    createPayment,
    findPaymentByReference,
    updatePaymentStatus,
} from "../repositories/payment.repository.js";


export const processSuccessfulPayment = async ({
    reference,
    amount,
    currency,
    channel,
    metadata,
    paidAt,
}) => {

    const existingPayment =
        await findPaymentByReference(
            reference
        );


    // Already successfully processed
    if (
        existingPayment &&
        existingPayment.status === "success"
    ) {

        console.log(
            `Payment ${reference} already processed.`
        );

        return existingPayment;
    }


    // Payment exists but wasn't successful
    if (existingPayment) {

        return await updatePaymentStatus(
            reference,
            {
                status: "success",
                amount,
                currency,
                channel,
                metadata,
                paidAt,
            }
        );
    }


    // Completely new payment
    return await createPayment({
        reference,
        amount,
        currency,
        channel,
        metadata,
        paidAt,
        status: "success",
        gateway: "paystack",
    });
};