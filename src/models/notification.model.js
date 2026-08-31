import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

    receiver: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

    },

    title: {

        type: String,

        required: true,

        trim: true,

    },

    message: {

        type: String,

        required: true,

        trim: true,

    },

    type: {
        type: String,
        enum: [
            "vendor",

            "listing",
            "listing_created",
            "listing_updated",
            "listing_cancelled",
            "listing_completed",
            "listing_expired",

            "reservation",
            "reservation_created",
            "reservation_completed",
            "reservation_cancelled",

            "payment_success",
            "payment_failed",

            "subscription_created",
            "subscription_cancelled",
            "subscription_expired",

            "vendor_profile_created",

            "password_reset",

            "system",
            "reminder",
            "promotion",
            "security",
        ],

        default: "system",
    },

    isRead: {

        type: Boolean,

        default: false,

    },

    priority: {

    type: String,

    enum: [

        "low",

        "medium",

        "high",

    ],

    default: "medium",

    },

    data: {

        type: mongoose.Schema.Types.Mixed,

        default: {},

    },

}, {

    timestamps: true,

});

export default mongoose.model(
    "Notification",
    notificationSchema
);