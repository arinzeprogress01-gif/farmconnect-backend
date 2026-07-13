export const listingPaths = {

    "/api/listings": {

        post: {

            tags: ["Food Listings"],

            summary: "Create Food Listing",

            description:
                "Allows an authenticated vendor with a completed profile to create a new food listing. The listing automatically expires after 30 minutes.",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            requestBody: {

                required: true,

                content: {

                    "application/json": {

                        schema: {

                            $ref:
                                "#/components/schemas/CreateListing",

                        },

                    },

                },

            },

            responses: {

                "201": {

                    description:
                        "Food listing created successfully.",

                },

                "400": {

                    $ref:
                        "#/components/responses/BadRequest",

                },

                "401": {

                    $ref:
                        "#/components/responses/Unauthorized",

                },

                "403": {

                    $ref:
                        "#/components/responses/Forbidden",

                },

            },

        },

    },
}