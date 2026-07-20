import Listing from "../models/listing.model.js";
import Reservation from "../models/reservation.model.js";

export const getVendorAnalytics = async (vendorId) => {

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const [

        totalListings,

        activeListings,

        completedListings,

        expiredListings,

        cancelledListings,

        totalReservations,

        completedReservations,

        cancelledReservations,

        mealsShared,


    ] = await Promise.all([

        Listing.countDocuments({

            vendorId,

        }),

        Listing.countDocuments({

            vendorId,

            status: "available",

            isActive: true,

        }),

        Listing.countDocuments({

            vendorId,

            status: "completed",

        }),

        Listing.countDocuments({

            vendorId,

            status: "expired",

        }),

        Listing.countDocuments({

            vendorId,

            status: "cancelled",

        }),

        Reservation.countDocuments({

            vendor: vendorId,

        }),

        Reservation.countDocuments({

            vendor: vendorId,

            status: "completed",

        }),

        Reservation.countDocuments({

            vendor: vendorId,

            status: "cancelled",

            

        }),

        Reservation.countDocuments({

            vendor: vendorId,

            createdAt: {

                $gte: today,

            },

        }),

        Reservation.aggregate([

            {

                $match: {

                    vendor: vendorId,

                    status: "completed",

                },

            },

            {

                $group: {

                    _id: null,

                    total: {

                        $sum:

                            "$quantityRequested",

                    },

                },

            },

        ]),

    ]);

    return {

        totalListings,

        activeListings,

        completedListings,

        expiredListings,

        cancelledListings,

        totalReservations,

        completedReservations,

        cancelledReservations,

        mealsShared:

            mealsShared[0]?.total || 0,

    };

};

export const getUserDashboardAnalytics = async (userId) => {

    const reservations = await Reservation.find({

        user: userId,

    });

    return reservations;

};