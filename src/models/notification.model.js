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