const analyticsSchemas = {

    DashboardAnalytics: {

        type: "object",

        properties: {

            totalListings: {

                type: "number",

                example: 25,

            },

            activeListings: {

                type: "number",

                example: 8,

            },

            completedListings: {

                type: "number",

                example: 12,

            },

            expiredListings: {

                type: "number",

                example: 3,

            },

            cancelledListings: {

                type: "number",

                example: 2,

            },

            totalReservations: {

                type: "number",

                example: 45,

            },

            todaysReservations: {

                type: "number",

                example: 6,

            },

            completedReservations: {

                type: "number",

                example: 39,

            },

            cancelledReservations: {

                type: "number",

                example: 4,

            },

            mealsShared: {

                type: "number",

                example: 97,

            },

        },

    },

    DashboardAnalyticsResponse: {

        type: "object",

        properties: {

            success: {

                type: "boolean",

                example: true,

            },

            message: {

                type: "string",

                example:
                    "Dashboard analytics retrieved successfully.",

            },

            analytics: {

                $ref:
                    "#/components/schemas/DashboardAnalytics",

            },

        },

    },

};

export default analyticsSchemas;