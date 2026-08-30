import { processSuccessfulPayment } from "./payment.service.js";
export const handlePaystackEvent = async (
    event,
    data
) => {

    switch (event) {

        case "charge.success":
            return await handleChargeSuccess(data);

        case "charge.failed":
            return await handleChargeFailed(data);

        default:
            console.log(
                `Unhandled Paystack event: ${event}`
            );

            return;
    }
};


const handleChargeSuccess = async (data) => {

    const payment =
        await processSuccessfulPayment({
            reference: data.reference,
            amount: data.amount,
            currency: data.currency,
            channel: data.channel,
            metadata: data.metadata,
            paidAt: data.paid_at,
        });

    console.log(
        `Paystack successful payment handled: ${payment.reference}`
    );

    return payment;
};


const handleChargeFailed = async (data) => {

    console.log(
        "Failed payment:",
        data.reference
    );

    return;

};