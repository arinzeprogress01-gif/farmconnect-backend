const devicePaths = {

    "/api/users/device": {

        post: {

            tags: ["Users"],

            summary:
                "Register User Device",

            description:
                "Registers a browser or device for push notifications. Existing devices are updated instead of duplicated.",

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

                            $ref: "#/components/schemas/DeviceInput",

                        },

                    },

                },

            },

            responses: {

                "200": {

                    description:
                        "Device registered successfully.",

                },

                "400": {

                    $ref:
                        "#/components/responses/BadRequest",

                },

                "401": {

                    $ref:
                        "#/components/responses/Unauthorized",

                },

            },

        },

    },

};

export default devicePaths;