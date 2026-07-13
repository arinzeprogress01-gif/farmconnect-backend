const listingSchemas = {

    Listing: {

        type: "object",

        properties: {

            listingId: {

                type: "string",

                example: "FC-LST-00001",

            },

            foodName: {

                type: "string",

                example: "Jollof Rice",

            },

            category: {

                type: "string",

                example: "Cooked Meals",

            },

            description: {

                type: "string",

                example: "Freshly prepared today.",

            },

            quantity: {

                type: "integer",

                example: 20,

            },

            pickupLocation: {

                type: "string",

                example: "Engineering Gate",

            },

            imageUrls: {

                type: "array",

                items: {

                    type: "string",

                    format: "uri",

                },

            },

            isHealthy: {

                type: "boolean",

                example: true,

            },

            status: {

                type: "string",

                example: "available",

            },

            expiresAt: {

                type: "string",

                format: "date-time",

            },

            totalReservations: {

                type: "integer",

                example: 0,

            },

        },

    },



    CreateListing: {

        type: "object",

        required: [

            "foodName",

            "category",

            "quantity"

        ],

        properties: {

            foodName: {

                type: "string",

                example: "Jollof Rice",

            },

            category: {

                type: "string",

                example: "Cooked Meals",

            },

            description: {

                type: "string",

            },

            quantity: {

                type: "integer",

                example: 20,

            },

            useVendorLocation: {

                type: "boolean",

                example: true,

            },

            pickupLocation: {

                type: "string",

                example: "Engineering Gate",

            },

            imageUrls: {

                type: "array",

                items: {

                    type: "string",

                    format: "uri",

                },

            },

            isHealthy: {

                type: "boolean",

                example: true,

            },

        },

    },

};

export default listingSchemas;