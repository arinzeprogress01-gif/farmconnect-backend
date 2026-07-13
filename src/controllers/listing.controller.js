import * as listingService from "../services/listing.service.js";

export const createListing = async (

    req,

    res,

    next

) => {

    try {

        const listing =

            await listingService.createNewListing(

                req.user._id,

                req.body

            );

        return res.status(201).json({

            success: true,

            message:

                "Listing created successfully.",

            data: listing,

        });

    } catch (error) {

        next(error);

    }

};

export const getMyListings = async (

    req,

    res,

    next

) => {

    try {

        const listings =

            await listingService.getMyListings(

                req.user._id

            );

        return res.status(200).json({

            success: true,

            count: listings.length,

            data: listings,

        });

    } catch (error) {

        next(error);

    }

};

export const marketList = async (

    req,

    res,

    next

) => {

    try {

        const listings =

            await listingService.marketList();

        return res.status(200).json({

            success: true,

            count: listings.length,

            data: listings,

        });

    }

    catch (error) {

        next(error);

    }

};

export const updateListing = async (

    req,

    res,

    next

) => {

    try {

        const listing =

            await listingService.updateMyListing(

                req.params.listingId,

                req.user._id,

                req.body

            );

        return res.status(200).json({

            success: true,

            message:

                "Listing updated successfully.",

            data: listing,

        });

    } catch (error) {

        next(error);

    }

};

export const deleteListing = async (

    req,

    res,

    next

) => {

    try {

        const listing =

            await listingService.deleteMyListing(

                req.params.listingId,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:

                "Listing removed successfully.",

            data: listing,

        });

    } catch (error) {

        next(error);

    }

};