import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import vendorOnly from "../middleware/vendor.middleware.js";

import {
    createListing,
    getMyListings,
    updateListing,
    deleteListing,
    marketList,
    getListingsByCategory,
    getFoodCategories,
    
} from "../controllers/listing.controller.js";

const router = express.Router();

router.post(

    "/",

    authenticate,

    vendorOnly,

    createListing

);

router.get(

    "/my-listings",

    authenticate,

    vendorOnly,

    getMyListings

);

router.get(

    "/market-list",

    marketList

);

router.get(

    "/categories",

    getFoodCategories

);

router.get(

    "/category/:category",

    getListingsByCategory

);

router.patch(

    "/:listingId",

    authenticate,

    vendorOnly,

    updateListing

);

router.delete(

    "/:listingId",

    authenticate,

    vendorOnly,

    deleteListing

);

export default router; 