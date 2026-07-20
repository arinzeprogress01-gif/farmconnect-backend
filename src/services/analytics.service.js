import {
    getVendorAnalytics,
} from "../repositories/analytics.repository.js";
import {

    getUserDashboardAnalytics as getUserDashboardAnalyticsRepository,

} from "../repositories/analytics.repository.js";

import {
    findVendorByUserId,
} from "../repositories/listing.repository.js";

import NotFoundError from "../errors/NotFoundError.js";

export const getDashboardAnalytics = async (
    userId
) => {

    const vendor =
        await findVendorByUserId(
            userId
        );

    if (!vendor) {

        throw new NotFoundError(
            "Vendor profile not found."
        );

    }

    return await getVendorAnalytics(
        vendor._id
    );

};

export const getUserDashboardAnalytics = async (

    userId

) => {

    const reservations =

        await getUserDashboardAnalyticsRepository(

            userId

        );

    const totalReservations =

        reservations.length;

    const activeReservations =

        reservations.filter(

            reservation =>

                reservation.status === "reserved"

        ).length;

    const completedReservations =

        reservations.filter(

            reservation =>

                reservation.status === "completed"

        ).length;

    const cancelledReservations =

        reservations.filter(

            reservation =>

                reservation.status === "cancelled"

        ).length;

    const mealsRescued =

        reservations

            .filter(

                reservation =>

                    reservation.status === "completed"

            )

            .reduce(

                (

                    total,

                    reservation

                ) =>

                    total +

                    reservation.quantityRequested,

                0

            );

    return {

        totalReservations,

        activeReservations,

        completedReservations,

        cancelledReservations,

        mealsRescued,

    };

};