import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        plan: {
            type: String,
            required: true,
            enum: [
                "free",
                "premium",
                "business",
            ],
            default: "free",
        },

        status: {
            type: String,
            required: true,
            enum: [
                "active",
                "expired",
                "cancelled",
                "pending",
            ],
            default: "pending",
        },

        gateway: {
            type: String,
            enum: ["paystack"],
            default: "paystack",
        },

        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
            default: null,
        },

        reference: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        startedAt: {
            type: Date,
            default: null,
        },

        expiresAt: {
            type: Date,
            default: null,
        },

        cancelledAt: {
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

subscriptionSchema.index({
    user: 1,
    status: 1,
});

const Subscription = mongoose.model(
    "Subscription",
    subscriptionSchema
);

export default Subscription;