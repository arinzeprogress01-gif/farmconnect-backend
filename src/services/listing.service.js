import listingSchema from "../validators/listing.validator.js";

import  sendNotification  from "../utils/sendNotification.js";

import { FOOD_CATEGORIES } from "../constants/foodCategories.js";

import User from "../models/user.models.js";

import VendorProfile from "../models/vendor.model.js";

import generateListingId from "../utils/generateListingId.js";

import {
    createListing,
    findUserById,
    findListingById,
    findVendorByUserId,
    getVendorListings,
    updateListing,
    getMarketListings,
    findListingsByCategory,
    getMarketListings as getMarketListingsRepo,
} from "../repositories/listing.repository.js";

import BadRequestError from "../errors/BadRequestError.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import { AppError } from "../errors/app.error.js";

export const createNewListing = async (

    userId,

    listingData

) => {


    const { error, value } =

        listingSchema.validate(listingData);

    if (error) {

        throw new BadRequestError(

            error.details[0].message

        );

    }


    const user = await findUserById(userId);

    if (!user) {

        throw new AppError(

            "User not found.",

            404

        );

    }


    if (!user.profileCompleted) {

        throw new ForbiddenError(

            "Complete your vendor profile before creating listings."

        );

    }


    const vendor =

        await findVendorByUserId(userId);

    if (!vendor) {

        throw new AppError(

            "Vendor profile not found.",

            404

        );

    }


    const listingId =

        await generateListingId();


    let pickupLocation;

    if (value.useVendorLocation) {

        pickupLocation =

            vendor.currentLocation;

    } else {

        pickupLocation =

            value.pickupLocation;

    };

    let price = value.price;

    if (value.isFree) {

        price = 0;

    };

    const expiryDuration =

        data.expiryDuration || 720;

    const expiresAt = new Date(

        Date.now()

        +

        (expiryDuration * 60 * 1000)

    );


    const listing =

        await createListing({

            listingId,

            vendorId: vendor._id,

            foodName: value.foodName,

            category: value.category,

            description: value.description,

            quantity: value.quantity,

            pickupLocation,

            imageUrls: value.imageUrls,

            isHealthy: value.isHealthy,

            expiryDuration,

            expiresAt,

            isFree: value.isFree,

            price,

        });
    
    await sendNotification({

        receiver: user._id,

        title: "Listing Published",

        message:
            `${listing.foodName} has been published successfully.`,

        type: "listing",

        priority: "medium",

        data: {

            listingId: listing.listingId,

            action: "OPEN_MY_LISTINGS",

        },

    });

    return listing;

};

export const getMyListings = async (

    userId

) => {

    const vendor =

        await findVendorByUserId(userId);

    if (!vendor) {

        throw new AppError(

            "Vendor profile not found.",

            404

        );

    }

    return await getVendorListings(

        vendor._id

    );

};


export const getMarketLists = async (query) => {

    if (query.category) {

        const validCategory = FOOD_CATEGORIES.find(

            item =>

                item.toLowerCase() ===

                query.category.toLowerCase()

        );

        if (!validCategory) {

            throw new BadRequestError(

                "Invalid food category."

            );

        }

        query.category = validCategory;

    }

    return await getMarketListingsRepo(query);

};

export const updateMyListing = async (

    listingId,

    userId,

    updateData

) => {

    const vendor =

        await findVendorByUserId(userId);

    if (!vendor) {

        throw new AppError(

            "Vendor profile not found.",

            404

        );

    }

    const listing =

        await findListingById(listingId);

    if (!listing) {

        throw new AppError(

            "Listing not found.",

            404

        );

    }

    if (

        listing.vendorId.toString()

        !==

        vendor._id.toString()

    ) {

        throw new ForbiddenError(

            "You can only update your own listings."

        );

    }

    const updatedListing =
        await updateListing(
            listingId,
            updateData
        );

    await sendNotification({

        receiver: userId,

        title: "Listing Updated",

        message:
            `${updatedListing.foodName} has been updated.`,

        type: "listing",

        priority: "low",

        data: {

            listingId:
                updatedListing.listingId,

            action:
                "OPEN_MY_LISTINGS",

        },

    });

    return updatedListing;

};

export const deleteMyListing = async (

    listingId,

    userId

) => {

    const vendor =

        await findVendorByUserId(userId);

    if (!vendor) {

        throw new AppError(

            "Vendor profile not found.",

            404

        );

    }

    const listing =

        await findListingById(listingId);

    if (!listing) {

        throw new AppError(

            "Listing not found.",

            404

        );

    }

    if (

        listing.vendorId.toString()

        !==

        vendor._id.toString()

    ) {

        throw new ForbiddenError(

            "You can only delete your own listings."

        );

    }

    const cancelledListing =
        await updateListing(
            listingId,
            {

                isActive: false,

                status: "cancelled",

            }
        );

    await sendNotification({

        receiver: userId,

        title: "Listing Cancelled",

        message:
            `${cancelledListing.foodName} has been removed from the marketplace.`,

        type: "listing",

        priority: "high",

        data: {

            listingId:
                cancelledListing.listingId,

            action:
                "OPEN_MY_LISTINGS",

        },

    });

    return cancelledListing;

};

export const getListingsByCategory = async (category) => {

    const validCategory = FOOD_CATEGORIES.find(

        item =>

            item.toLowerCase() ===

            category.toLowerCase()

    );

    if (!validCategory) {

        throw new BadRequestError(

            "Invalid food category."

        );

    }

    return await findListingsByCategory(

        validCategory

    );

};

export const getFoodCategories = async () => {

    return FOOD_CATEGORIES;

};