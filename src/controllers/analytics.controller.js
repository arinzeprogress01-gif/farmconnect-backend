import {
    getDashboardAnalytics,
    getUserDashboardAnalytics,
} from "../services/analytics.service.js";

export const dashboardAnalytics =
    async (
        req,
        res,
        next
    ) => {

        try {

            const analytics =
                await getDashboardAnalytics(
                    req.user._id
                );

            res.status(200).json({

                success: true,

                message:
                    "Dashboard analytics retrieved successfully.",

                analytics,

            });

        } catch (error) {

            next(error);

        }

    };

export const userDashboardAnalytics = async (

    req,

    res,

    next

) => {

    try {

        const analytics =

            await getUserDashboardAnalytics(

                req.user._id

            );

        res.status(200).json({

            success: true,

            message:

                "User dashboard analytics retrieved successfully.",

            data: analytics,

        });

    } catch (error) {

        next(error);

    }

};