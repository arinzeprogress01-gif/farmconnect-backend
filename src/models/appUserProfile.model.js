import mongoose from "mongoose";

const appUserProfileSchema = new mongoose.Schema(

    {

        userId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

            unique: true,

        },

        fullName: {

            type: String,

            required: true,

            trim: true,

        },

        phone: {

            type: String,

            required: true,

            trim: true,

        },

        profileImage: {

            type: String,

            default: "",

        },

        gender: {

            type: String,

            enum: [

                "male",

                "female",

                "prefer_not_to_say",

            ],

        },

        dateOfBirth: {

            type: Date,

        },

        address: {

            type: String,

            trim: true,

        },

        city: {

            type: String,

            trim: true,

        },

        state: {

            type: String,

            trim: true,

        },

        preferredFoodCategories: [

            {

                type: String,

            },

        ],

        bio: {

            type: String,

            maxlength: 300,

            trim: true,

        },
        savedVendors: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "VendorProfile",

            },

        ],

    },

    {

        timestamps: true,

    }

);

const AppUserProfile = mongoose.model(

    "AppUserProfile",

    appUserProfileSchema

);

export default AppUserProfile;