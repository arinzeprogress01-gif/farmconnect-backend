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

            "reservation",

            "listing",

            "system",

            "reminder",

            "promotion",

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