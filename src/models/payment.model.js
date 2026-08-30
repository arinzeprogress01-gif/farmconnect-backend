import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        reference: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: "NGN",
            uppercase: true,
            trim: true,
        },

        status: {
            type: String,
            required: true,
            enum: [
                "pending",
                "success",
                "failed",
            ],
            default: "pending",
        },

        channel: {
            type: String,
            default: null,
            trim: true,
        },

        gateway: {
            type: String,
            default: "paystack",
            enum: ["paystack"],
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        paidAt: {
            type: Date,
            default: null,
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model(
    "Payment",
    paymentSchema
);

export default Payment;