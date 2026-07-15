import Listing from "../models/listing.model.js";
import VendorProfile from "../models/vendor.model.js";
import User from "../models/user.models.js"

export const createListing = async (data) => {

    return await Listing.create(data);

};

export const findUserById = async (userId) => {

    return await User.findById(userId);

};

export const findListingById = async (
    listingId
) => {

    return await Listing.findOne({

        listingId,

    });

};

export const findListingByObjectId = async (
    id
) => {

    return await Listing.findById(id);

};
export const findVendorByUserId = async (
    userId
) => {

    return await VendorProfile.findOne({

        userId,

    });

};

export const getVendorListings = async (
    vendorId
) => {

    return await Listing.find({

        vendorId,

    }).sort({

        createdAt: -1,

    });

};

export const getMarketListings = async () => {

    return await Listing.find({

        isActive: true,

        status: "available",

        quantity: {

            $gt: 0,

        },

        expiresAt: {

            $gt: new Date(),

        },

    })

    .populate({

        path: "vendorId",

        select: "businessName profileImage businessType",

    })

    .sort({

        createdAt: -1,

    });

};

export const updateListing = async (

    listingId,

    data

) => {

    return await Listing.findOneAndUpdate(

        {

            listingId,

        },

        data,

        {

            new: true,

            runValidators: true,

        }

    );

};

export const deleteListing = async (
    listingId
) => {

    return await Listing.findOneAndDelete({

        listingId,

    });

};