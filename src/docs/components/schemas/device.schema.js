const deviceSchemas = {

    DeviceInput: {

        type: "object",

        required: [

            "token"

        ],

        properties: {

            token: {

                type: "string",

                example:

                    "fcm_device_token",

            },

            platform: {

                type: "string",

                example: "web",

            },

            browser: {

                type: "string",

                example: "Chrome",

            },

        },

    },

};

export default deviceSchemas;