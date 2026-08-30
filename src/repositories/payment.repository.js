import Payment from "../models/payment.model.js";

export const createPayment = async (paymentData) => {
    return await Payment.create(paymentData);
};

export const findPaymentByReference = async (
    reference
) => {
    return await Payment.findOne({
        reference,
    });
};

export const updatePaymentStatus = async (
    reference,
    updateData
) => {
    return await Payment.findOneAndUpdate(
        { reference },
        { $set: updateData },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );
};