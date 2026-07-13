const vendorProfileSchema = {

    VendorProfileInput: {

        type: "object",

        required: [

            "businessName",

            "businessType",

            "email",

            "phone",

            "permanentAddress",

            "currentLocation",

        ],

        properties: {

            businessName: {

                type: "string",

                example: "Mama Gold Kitchen",

            },

            businessType: {

                type: "string",

                example: "Restaurant",

            },

            description: {

                type: "string",

                example:
                    "Affordable homemade meals.",

            },

            email: {

                type: "string",

                format: "email",

                example:
                    "mamagold@gmail.com",

            },

            phone: {

                type: "string",

                example:
                    "08012345678",

            },

            permanentAddress: {

                type: "string",

                example:
                    "Awka, Anambra",

            },

            currentLocation: {

                type: "string",

                example:
                    "UNIZIK Main Gate",

            },

            profileImage: {

                type: "string",

                example:
                    "https://example.com/profile.jpg",

            },

            operatingHours: {

                type: "string",

                example:
                    "8AM - 8PM",

            },

        },

    },

};

export default vendorProfileSchema;