const appUserProfileResponseSchemas = {

    AppUserProfileResponse: {

        type: "object",

        properties: {

            _id: {

                type: "string",

                example:
                    "6878e2d15aef37c7d3db42a4",

            },

            userId: {

                type: "string",

                example:
                    "6878d5f65aef37c7d3db42a1",

                description:
                    "Authenticated user's ID.",

            },

            fullName: {

                type: "string",

                example: "John Doe",

            },

            phone: {

                type: "string",

                example: "+2348012345678",

            },

            profileImage: {

                type: "string",

                format: "uri",

                example:
                    "https://example.com/profile.jpg",

            },

            gender: {

                type: "string",

                example: "male",

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

            createdAt: {

                type: "string",

                format: "date-time",

            },

            updatedAt: {

                type: "string",

                format: "date-time",

            },

        },

    },

};

export default appUserProfileResponseSchemas;