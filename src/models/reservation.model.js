import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
    {
        reservationId: {
            type: String,
            required: true,
            unique: true,
        },

        pickupCode: {
            type: String,
            required: true,
        },

        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },

        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "VendorProfile",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        foodName: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        pickupLocation: {
            type: String,
            required: true,
        },

        quantityRequested: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: [
                "reserved",
                "cancelled",
                "completed",
            ],
            default: "reserved",
        },

        cancellationReason: {
            type: String,
            default: null,
        },
        reservedAt: {

            type: Date,

            default: Date.now,

        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Reservation = mongoose.model(
    "Reservation",
    reservationSchema
);

export default Reservation;