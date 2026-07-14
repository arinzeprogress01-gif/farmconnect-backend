const appUserProfileSchemas = {

    AppUserProfileInput: {

        type: "object",

        required: [

            "fullName",

            "phone",

        ],

        properties: {

            fullName: {

                type: "string",

                example: "John Doe",

                description:
                    "User's full legal name.",

            },

            phone: {

                type: "string",

                example: "+2348012345678",

                description:
                    "Active phone number.",

            },

            profileImage: {

                type: "string",

                format: "uri",

                example:
                    "https://example.com/profile.jpg",

            },

            gender: {

                type: "string",

                enum: [

                    "male",

                    "female",

                    "prefer_not_to_say",

                ],

            },

            dateOfBirth: {

                type: "string",

                format: "date",

                example: "2000-05-16",

            },

            address: {

                type: "string",

                example:
                    "12 Admiralty Way",

            },

            city: {

                type: "string",

                example: "Lekki",

            },

            state: {

                type: "string",

                example: "Lagos",

            },

            preferredFoodCategories: {

                type: "array",

                items: {

                    type: "string",

                },

                example: [

                    "Cooked Meals",

                    "Bakery",

                    "Snacks",

                ],

            },

            bio: {

                type: "string",

                example:
                    "I enjoy discovering healthy meals around my city.",

            },

        },

    },

};

export default appUserProfileSchemas;