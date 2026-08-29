import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: [
                "listing_created",
                "free_meal_shared",
                "reservation_created",
                "reservation_completed",
                "reservation_cancelled",
            ],
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        audience: {
            type: String,
            enum: ["user", "vendor", "both"],
            default: "both",
            required: true,
        },

        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "VendorProfile",
            default: null,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            default: null,
        },

        reservation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reservation",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

activitySchema.index({
    audience: 1,
    createdAt: -1,
});

export default mongoose.model(
    "Activity",
    activitySchema
);