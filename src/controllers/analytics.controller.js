import {
    getDashboardAnalytics,
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