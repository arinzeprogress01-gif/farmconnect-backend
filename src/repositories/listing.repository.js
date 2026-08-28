import Listing from "../models/listing.model.js";
import VendorProfile from "../models/vendor.model.js";
import User from "../models/user.models.js"
import { findAppUserByUserId } from "./appUser.repository.js";
import { isValidCoordinates } from "../utils/geoLocation.js";
import BadRequestError from "../errors/BadRequestError.js"

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
    vendorId,
    search = ""
) => {

    const query = {
        vendorId,
    };

    if (search) {

        query.$or = [

            {
                foodName: {
                    $regex: new RegExp(search, "i"),
                },
            },

            {
                description: {
                    $regex: new RegExp(search, "i"),
                },
            },

            {
                category: {
                    $regex: new RegExp(search, "i"),
                },
            },

            {
                pickupLocation: {
                    $regex: new RegExp(search, "i"),
                },
            },

        ];
    }

    return await Listing.find(query)
        .sort({
            createdAt: -1,
        });

};


export const getMarketListings = async (filters = {}) => {

    const {

        category,

        location,

        search,

        vendorId,

        isFree,

    } = filters;

    const query = {

        status: {
            $in: [
                "available",
                "pendingCompletion",
            ],
        },

        isActive: true,

    };

    // Category Filter
    // Category Filter
    if (category) {

        const escapedCategory = category.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        query.category = {

            $regex: new RegExp(
                `^${escapedCategory}$`,
                "i"
            ),

        };

    }

    // Location Filter
    if (location) {

        const escapedLocation = location.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        query.pickupLocation = {

            $regex: new RegExp(
                escapedLocation,
                "i"
            ),

        };

    }

    if (vendorId) {

        query.vendorId = vendorId;

    }

    // Free / Paid Filter
    if (typeof isFree !== "undefined") {

        query.isFree =

            isFree === "true";

    }

    // General Search
    if (search) {

        const vendors = await VendorProfile.find({

            businessName: {

                $regex: search,

                $options: "i",

            },

        });

        query.$or = [

            {

                foodName: {

                    $regex: search,

                    $options: "i",

                },

            },

            {

                description: {

                    $regex: search,

                    $options: "i",

                },

            },

            {

                category: {

                    $regex: search,

                    $options: "i",

                },

            },

            {

                pickupLocation: {

                    $regex: search,

                    $options: "i",

                },

            },

            {

                vendorId: {

                    $in: vendors.map(v => v._id),

                },

            },

        ];

    }

    return Listing.find(query)

        .populate(

            "vendorId",

            "businessName currentLocation profileImage"

        )

        .sort({

            createdAt: -1,

        });

};

export const findListingsByCategory = async (category) => {

    return await Listing.find({

        category: {

            $regex: new RegExp(`^${category}$`, "i"),

        },

        status: "available",

        isActive: true,

    })

        .populate(

            "vendorId",

            "businessName currentLocation profileImage"

        )

        .sort({

            createdAt: -1,

        });

};



export const findNearbyListings = async (userId) => {

    console.log("searching AppUserProfile with:" , userId)

    const userProfile = await findAppUserByUserId(userId);
    console.log("Found AppUserProfile :", userProfile)

    if (!userProfile) {
        return null;
    }

    const vendors = await VendorProfile.find({
        city: userProfile.city,
        state: userProfile.state,
    });

    const vendorIds = vendors.map(v => v._id);

    return await Listing.find({
        vendorId: {
            $in: vendorIds,
        },
        status: "available",
        isActive: true,
    }).populate(
        "vendorId",
        "businessName currentLocation profileImage"
    );
};

export const findNearbyListingsByCoordinates = async (
    longitude,
    latitude,
    maxDistance = 30000
) => {
    if (
        !isValidCoordinates(
            longitude,
            latitude
        )
    ) {
        throw new BadRequestError(
            "Invalid location coordinates."
        );
    }

    const listings = await Listing.find({

        location: {

            $near: {

                $geometry: {

                    type: "Point",

                    coordinates: [
                        Number(longitude),
                        Number(latitude),
                    ],

                },

                $maxDistance:
                    Number(maxDistance),

            },

        },

        status: {

            $in: [
                "available",
                "pendingCompletion",
            ],

        },

        isActive: true,

    })
        .populate(
            "vendorId",
            "businessName currentLocation"
        )
        .sort({
            createdAt: -1,
        });

    return listings;
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

            returnDocument: "after",

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