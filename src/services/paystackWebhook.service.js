import {
    processSuccessfulPayment,
} from "./payment.service.js";

import {
    activateSubscription,
} from "./subscription.service.js";

import {
    createActivity,
} from "./activity.service.js";

import 
    sendNotification from "../utils/sendNotification.js";

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

    const result =
        await processSuccessfulPayment({

            reference: data.reference,

            amount: data.amount,

            currency: data.currency,

            channel: data.channel,

            metadata: data.metadata,

            paidAt: data.paid_at,

            user: data.metadata?.userId,

        });


    const {
        payment,
        isNewPayment,
    } = result;


    // Webhook retry / already processed
    if (!isNewPayment) {

        console.log(
            `Skipping downstream processing for ${payment.reference}.`
        );

        return payment;
    }


    console.log(
        `Paystack successful payment handled: ${payment.reference}`
    );


    /*
        PAYMENT ACTIVITY
    */

    await createActivity({

        type: "payment_success",

        message:
            "Your FarmConnect payment was completed successfully.",

        audience: "user",

        user: payment.user,

    });


    /*
        PAYMENT NOTIFICATION
    */

    if (payment.user) {

        await sendNotification({

            receiver: payment.user,

            title:
                "Payment Successful",

            message:
                "Your FarmConnect payment was completed successfully.",

            type: "payment_success",

            priority: "high",

            data: {

                paymentId:
                    payment._id,

                reference:
                    payment.reference,

                action:
                    "OPEN_PAYMENT_HISTORY",

            },

        });

    }


    /*
        SUBSCRIPTION
    */

    if (payment.user) {

        await activateSubscription({

            userId:
                payment.user,

            plan:
                payment.metadata?.plan,

            paymentId:
                payment._id,

            reference:
                payment.reference,

            startedAt:
                payment.paidAt,

            expiresAt:
                payment.metadata?.expiresAt,

        });

    }


    return payment;
};

const handleChargeFailed = async (data) => {

    console.log(
        "Failed payment:",
        data.reference
    );

    return;

};