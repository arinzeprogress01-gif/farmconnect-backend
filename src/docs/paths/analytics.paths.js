const analyticsPaths = {

    "/api/analytics/dashboard": {

        get: {

            tags: ["Analytics"],

            summary:
                "Get vendor dashboard analytics",

            description:
                "Returns dashboard statistics for the authenticated vendor.",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            responses: {

                200: {

                    description:
                        "Analytics retrieved successfully.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref:
                                    "#/components/schemas/DashboardAnalyticsResponse",

                            },

                        },

                    },

                },

                401: {

                    description:
                        "Unauthorized.",

                },

                403: {

                    description:
                        "Only vendors can access analytics.",

                },

                404: {

                    description:
                        "Vendor profile not found.",

                },

            },

        },

    },

};

export default analyticsPaths;