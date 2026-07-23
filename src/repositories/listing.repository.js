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


export const getMarketListings = async (filters = {}) => {

    const {

        category,

        location,

        search,

        vendor,

        isFree,

    } = filters;

    const query = {

        status: "available",

        isActive: true,

    };

    // Category Filter
    if (category) {

        query.category = {

            $regex: new RegExp(`^${category}$`, "i"),

        };

    }

    // Pickup Location Filter
    if (location) {

        query.pickupLocation = {

            $regex: new RegExp(location, "i"),

        };

    }

    // Free / Paid Filter
    if (typeof isFree !== "undefined") {

        query.isFree =

            isFree === "true";

    }

    // General Search
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

    // Vendor Search
    if (vendor) {

        const vendors = await VendorProfile.find({

            businessName: {

                $regex: new RegExp(vendor, "i"),

            },

        });

        query.vendorId = {

            $in: vendors.map(

                vendor => vendor._id

            ),

        };

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