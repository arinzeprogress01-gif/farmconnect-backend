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

    "/api/v1/listings/category/{category}": {

        get: {

            category: `
   
        enum:
            - Cooked Meals
            - Rice Dishes
                - Soups
            - Bakery
            - Bread
            - Pastries
            - Snacks
            - Fast Food
            - Grilled Foods
            - Seafood
            - Vegetables
            - Fruits
            - Desserts
            - Drinks
            - Beverages
            - Local Delicacies`,

            summary: "Get Listings by Category",

            description:
                "Retrieves all available food listings for a specified category.",

            parameters: [

                {

                    name: "category",

                    in: "path",

                    required: true,

                    description: "The category of food listings to retrieve",

                    schema: {

                        type: "string",

                    },

                },

            ],

            responses: {

                "200": {

                    description:
                        "Listings retrieved successfully.",

                },

                "400": {

                    $ref:
                        "#/components/responses/BadRequest",

                },

                "404": {

                    $ref:
                        "#/components/responses/NotFound",

                },

            },

        },

        "/api/v1/listings/market-list": {
            get: {
                tags: ["Listings"],
                summary: "Get Marketplace Listings",
                description:
                    "Retrieves all available food listings in the marketplace. Supports optional filtering by category, location, and food name.",

                operationId: "getMarketplaceListings",

                parameters: [
                    {
                        in: "query",
                        name: "category",
                        required: false,
                        schema: {
                            type: "string",
                            enum: [
                                "Cooked Meals",
                                "Rice Dishes",
                                "Soups",
                                "Bakery",
                                "Bread",
                                "Pastries",
                                "Snacks",
                                "Fast Food",
                                "Grilled Foods",
                                "Seafood",
                                "Vegetables",
                                "Fruits",
                                "Desserts",
                                "Drinks",
                                "Beverages",
                                "Local Delicacies",
                            ],
                        },
                        example: "Bakery",
                        description:
                            "Filter listings by food category.",
                    },
                    {
                        in: "query",
                        name: "location",
                        required: false,
                        schema: {
                            type: "string",
                        },
                        example: "Awka",
                        description:
                            "Filter listings by pickup location.",
                    },
                    {
                        in: "query",
                        name: "search",
                        required: false,
                        schema: {
                            type: "string",
                        },
                        example: "Rice",
                        description:
                            "Search listings by food name.",
                    },
                ],

                responses: {
                    200: {
                        description:
                            "Marketplace listings retrieved successfully.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        message: {
                                            type: "string",
                                            example:
                                                "Marketplace listings retrieved successfully.",
                                        },
                                        count: {
                                            type: "integer",
                                            example: 5,
                                        },
                                        data: {
                                            type: "array",
                                            items: {
                                                $ref: "#/components/schemas/Listing",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        $ref: "#/components/responses/BadRequest",
                    },
                    404: {
                        $ref: "#/components/responses/NotFound",
                    },
                    500: {
                        $ref: "#/components/responses/InternalServerError",
                    },
                },
            },
        },

    }

}