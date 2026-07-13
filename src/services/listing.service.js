import listingSchema from "../validators/listing.validator.js";

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
    getMarketListings
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

    }


    const expiresAt =

        new Date(

            Date.now()

            +

            (30 * 60 * 1000)

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

            expiresAt,

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


export const marketList = async () => {

    return await getMarketListings();

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

    return await updateListing(

        listingId,

        updateData

    );

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

    return await updateListing(

        listingId,

        {

            isActive: false,

            status: "cancelled",

        }

    );

};