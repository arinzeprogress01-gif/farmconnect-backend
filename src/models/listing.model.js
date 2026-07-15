import mongoose from "mongoose";
import {FOOD_CATEGORIES} from "../constants/foodCategories.js";

const listingSchema = new mongoose.Schema({

    vendorId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "VendorProfile",

        required: true,

    },
    listingId: {

        type: String,

        unique: true,

        required: true,

    },

    foodName: {

        type: String,

        required: true,

        trim: true,

        maxlength: 100,

    },

    category: {

        type: String,

        required: true,

        enum: FOOD_CATEGORIES,

        trim: true,

    },
    isFree: {
        type: Boolean,
        default: false,
    },

    price: {
        type: Number,
        default: 0,
        min: 0,
    },

    description: {

        type: String,

        trim: true,

        maxLength: 500,

        default: "",

    },

    quantity: {

        type: Number,

        required: true,

        min: 1,

    },

    imageUrls: [

        {

            type: String,

        },

    ],

    pickupLocation: {

        type: String,

        required: true,

    },

    expiresAt: {

        type: Date,

        required: true,

    },

    status: {

        type: String,

        enum: [

            "available",

            "expired",

            "completed",

            "cancelled",

        ],

        default: "available",

    },

    isHealthy: {

        type: Boolean,

        default: true,

    },
    totalReservations: {

        type: Number,

        default: 0,

    },

    isActive: {
        
        type: Boolean,

        default: true,
    }

}, {

    timestamps: true,

});

export default mongoose.model(
    "Listing",
    listingSchema
);