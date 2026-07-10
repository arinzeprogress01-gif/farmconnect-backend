const schemas = {

    RegisterRequest: {

        type: "object",

        required: [
            "fullName",
            "email",
            "phone",
            "password",
            "confirmPassword",
            "role",
        ],

        properties: {

            fullName: {

                type: "string",

                minLength: 3,

                maxLength: 100,

                example: "Higgs Progress",

                description:
                    "The user's full name.",

            },

            email: {

                type: "string",

                format: "email",

                example: "higgs@gmail.com",

                description:
                    "Must be a valid email address.",

            },

            phone: {

                type: "string",

                minLength: 11,

                maxLength: 15,

                example: "08012345678",

                description:
                    "Primary contact of the account owner.",

            },

            password: {

                type: "string",

                minLength: 8,

                maxLength: 100,

                pattern:
                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",

                example: "Password123",

                description:
                                `
            Password Requirements

            • Minimum 8 characters

            • At least one uppercase letter

            • At least one lowercase letter

            • At least one number

            Regex:

            ^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$
            `,

            },

            confirmPassword: {

                type: "string",

                example: "Password123",

                description:
                    "Must exactly match the password field.",

            },

            role: {

                type: "string",

                enum: [

                    "user",

                    "vendor",

                ],

                description:
                    `
                user

                Students, residents, charities and other food seekers.

                vendor

                Restaurants, bakeries, supermarkets and other food providers.
                `,

            },

        },

    },
    LoginRequest: {

        type: "object",

        required: [

            "email",

            "password",

        ],

        properties: {

            email: {

                type: "string",

                format: "email",

                example: "higgs@gmail.com",

            },

            password: {

                type: "string",

                example: "Password123",

            },

        },

    },
    User: {

        type: "object",

        properties: {

            id: {

                type: "string",

                example:
                    "687e03ab98384f84bca761c8",

            },

            fullName: {

                type: "string",

                example:
                    "Higgs Progress",

            },

            email: {

                type: "string",

                example:
                    "higgs@gmail.com",

            },

            phone: {

                type: "string",

                example:
                    "08012345678",

            },

            role: {

                type: "string",

                enum: [

                    "user",

                    "vendor",

                ],

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
    AuthResponse: {

        type: "object",

        properties: {

            success: {

                type: "boolean",

                example: true,

            },

            message: {

                type: "string",

                example:
                    "Registration successful.",

            },

            data: {

                type: "object",

                properties: {

                    user: {

                        $ref:
                            "#/components/schemas/User",

                    },

                    token: {

                        type: "string",

                        description:
                            "JWT Authentication Token",

                        example:
                            "eyJhbGciOiJIUzI1NiIs...",

                    },

                },

            },

        },

    },
    ErrorResponse: {

        type: "object",

        properties: {

            success: {

                type: "boolean",

                example: false,

            },

            message: {

                type: "string",

                example:
                    "Validation failed.",

            },

        },

    },

};

export default schemas;