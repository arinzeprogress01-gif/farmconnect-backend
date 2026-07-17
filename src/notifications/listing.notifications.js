export const LISTING_CREATED = (

    listing

) => ({

    title:

        "Listing Published",

    message:

        `"${listing.foodName}" is now live in the marketplace.`,

    type:

        "listing",

});

export const LISTING_EXPIRED = (

    listing

) => ({

    title:

        "Listing Expired",

    message:

        `"${listing.foodName}" has expired and is no longer visible.`,

    type:

        "listing",

});

export const LISTING_COMPLETED = (

    listing

) => ({

    title:

        "Listing Completed",

    message:

        `All portions of "${listing.foodName}" have been reserved.`,

    type:

        "listing",

});

export const LISTING_CANCELLED = (

    listing

) => ({

    title:

        "Listing Cancelled",

    message:

        `Your listing "${listing.foodName}" has been cancelled.`,

    type:

        "listing",

});

export const LOW_QUANTITY = (

    listing

) => ({

    title:

        "Low Quantity",

    message:

        `"${listing.foodName}" is almost sold out.`,

    type:

        "listing",

});