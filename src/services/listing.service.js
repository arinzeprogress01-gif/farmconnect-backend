import listingSchema from "../validators/listing.validator.js";
import Reservation from "../models/reservation.model.js";

import  sendNotification  from "../utils/sendNotification.js";

import { FOOD_CATEGORIES } from "../constants/foodCategories.js";

import {
    isValidCoordinates,
    createGeoPoint,
} from "../utils/geoLocation.js";

import generateListingId from "../utils/generateListingId.js";
import { createActivity } from "../services/activity.service.js";

import {
    createListing,
    findUserById,
    findListingById,
    findVendorByUserId,
    getVendorListings,
    updateListing,
    findListingsByCategory,
    getMarketListings as getMarketListingsRepo,
    findNearbyListings,
    findNearbyListingsByCoordinates,
} from "../repositories/listing.repository.js";

import BadRequestError from "../errors/BadRequestError.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import { AppError } from "../errors/app.error.js";
import NotFoundError from "../errors/NotFoundError.js";

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
    let location;

    if (value.useVendorLocation) {

        pickupLocation = vendor.currentLocation;

        // Vendor's saved coordinates become the listing's geographic location.
        location = vendor.location;

    } else {

        pickupLocation = value.pickupLocation;

        if (
            !isValidCoordinates(
                value.longitude,
                value.latitude
            )
        ) {
            throw new BadRequestError(
                "Invalid pickup coordinates."
            );
        }

        location = createGeoPoint(
            value.longitude,
            value.latitude
        );
    }

    let price = value.price;

    if (value.isFree) {

        price = 0;

    };

    const expiryDuration =
        
        value.expiryDuration ?? 720;

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

            totalQuantity: value.quantity,

            quantity: value.quantity,

            pickupLocation,

            location,

            pickupDuration: value.pickupDuration,

            imageUrls: value.imageUrls,

            isHealthy: value.isHealthy,

            expiryDuration,

            expiresAt,

            isFree: value.isFree,

            price,

        });

    const activityType = value.isFree
        ? "free_meal_shared"
        : "listing_created";

    const activityMessage = value.isFree
        ? `${vendor.businessName} just put up free ${listing.foodName}`
        : `${vendor.businessName} just added a new ${listing.foodName} listing`;

    await createActivity({
        type: activityType,
        message: activityMessage,
        audience: "user",
        vendor: vendor._id,
        listing: listing._id,
    });

    const activityType1 = value.isFree
        ? "free_meal_shared"
        : "listing_created";

    const activityMessage1 = value.isFree
        ? `You just put up free ${listing.foodName}`
        : `You just added a new ${listing.foodName} listing`;

    await createActivity({
        type: activityType1,
        message: activityMessage1,
        audience: "vendor",
        vendor: vendor._id,
        listing: listing._id,
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

    const listingObject = listing.toObject();

    listingObject.minutesLeft = Math.max(
        0,
        Math.ceil((listing.expiresAt - new Date()) / (1000 * 60))
    );

    return listingObject;
};

export const getMyListings = async (

    userId,

    search

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

        vendor._id,

        search

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

export const getNearbyListingsService = async (
    userId,
    longitude,
    latitude,
    maxDistance = 30000
) => {

    // If coordinates are supplied, use real geographic proximity.
    if (
        longitude !== undefined &&
        latitude !== undefined
    ) {

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

        return await findNearbyListingsByCoordinates(
            Number(longitude),
            Number(latitude),
            Number(maxDistance)
        );
    }

    // Existing nearby logic remains untouched.
    const listings =
        await findNearbyListings(userId);

    if (listings === null) {

        throw new NotFoundError(
            "User profile not found."
        );

    }

    return listings;
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
        listing.vendorId.toString() !==
        vendor._id.toString()
    ) {
        throw new ForbiddenError(
            "You can only update your own listings."
        );
    }

    /*
        quantity from the edit form represents
        the NEW TOTAL quantity of the listing.
    */

    if (updateData.quantity !== undefined) {

        const newTotalQuantity =
            Number(updateData.quantity);

        /*
            Meals already reserved must remain reserved.

            Example:

            totalQuantity = 10
            quantity      = 6

            4 meals are currently reserved.

            If vendor changes total to 15:

            totalQuantity = 15
            quantity      = 11
        */

        const reservedQuantity =
            listing.totalQuantity -
            listing.quantity;

        if (
            newTotalQuantity <
            reservedQuantity
        ) {
            throw new BadRequestError(
                `Quantity cannot be less than the ${reservedQuantity} meal(s) already reserved.`
            );
        }

        updateData.totalQuantity =
            newTotalQuantity;

        updateData.quantity =
            newTotalQuantity -
            reservedQuantity;
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

export const getListingDetails = async (listingId) => {

    const listing =
        await findListingById(listingId);

    if (!listing) {

        throw new NotFoundError(
            "Food listing not found."
        );

    }

    // ==============================
    // RECENT RESERVATIONS
    // ==============================

    const recentReservations =
        await Reservation
            .find({
                listing: listing._id,
            })
            .populate(
                "user",
                "fullName"
            )
            .sort({
                createdAt: -1,
            })
            .limit(4)
            .lean();


    // ==============================
    // RESERVATION SUMMARY
    // ==============================

    const reservationSummary =
        await Reservation.aggregate([

            {
                $match: {
                    listing: listing._id,
                },
            },

            {
                $group: {

                    _id: null,

                    totalReservations: {
                        $sum: 1,
                    },

                    reservedQuantity: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "reserved",
                                    ],
                                },
                                "$quantityRequested",
                                0,
                            ],
                        },
                    },

                    completedPickups: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "completed",
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    pendingPickups: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "reserved",
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    expired: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$status",
                                        "expired",
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                },

            },

        ]);


    // ==============================
    // DEFAULT SUMMARY
    // ==============================

    const summary =
        reservationSummary[0] || {

            totalReservations: 0,

            reservedQuantity: 0,

            completedPickups: 0,

            pendingPickups: 0,

            expired: 0,

        };


    // ==============================
    // QUANTITY CALCULATIONS
    // ==============================

    const totalQuantity =
        listing.totalQuantity;

    const availableQuantity =
        listing.quantity;

    const reservedQuantity =
        summary.reservedQuantity;

    const reservedPercentage =
        totalQuantity > 0
            ? Math.round(
                (
                    reservedQuantity /
                    totalQuantity
                ) * 100
            )
            : 0;


    // ==============================
    // RESPONSE
    // ==============================

    return {

        listingId:
            listing.listingId,

        foodName:
            listing.foodName,

        category:
            listing.category,

        totalQuantity,

        reservedQuantity,

        availableQuantity,

        reservedPercentage,

        reservationSummary: {

            totalReservations:
                summary.totalReservations,

            completedPickups:
                summary.completedPickups,

            pendingPickups:
                summary.pendingPickups,

            expired:
                summary.expired,

        },

        recentReservations,

    };

};