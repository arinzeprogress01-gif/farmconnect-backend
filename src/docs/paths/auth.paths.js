const authPaths = {

    "/api/v1/auth/register": {

        post: {

            tags: ["Authentication"],

            summary: "Register a new account",

            description: `
            ## Overview

            FoodShare is a RESTful backend API designed to reduce food waste by connecting food vendors with nearby users who can reserve surplus meals before they expire.

            The API follows a layered architecture consisting of:

            • Controllers
            • Services
            • Repositories
            • Models
            • Middleware
            • Validation
            • Utility Helpers

            Authentication is handled using JWT.

            Passwords are hashed using bcrypt before storage.

            All request payloads are validated using Joi before reaching the business logic.

            This documentation serves as the single source of truth for frontend developers integrating with the API.
            `,

            contact: {

                name: "Nnoli Arinze Progress",

                email: "arinze.progress01@gmail.com",

            },

            operationId: "registerUser",

            requestBody: {

                required: true,

                content: {

                    "application/json": {

                        schema: {

                            $ref: "#/components/schemas/RegisterRequest",

                        },

                    },

                },

            },

            responses: {

                200: {
                    "success": true,
                    "message": "Registration successful.",
                    "data": {
                        "user": {
                            "id": "687e03ab98384f84bca761c8",
                            "fullName": "Higgs Progress",
                            "email": "higgs@gmail.com",
                            "phone": "08012345678",
                            "role": "user"
                        },
                        "token": "eyJhbGciOiJIUzI1NiIs..."
                    }
            },

                201: {

                    description: "Registration successful.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref: "#/components/schemas/AuthResponse",

                            },

                        },

                    },

                },

                400: {

                    $ref: "#/components/responses/BadRequest",

                },

                409: {

                    $ref: "#/components/responses/Conflict",

                },

                500: {

                    $ref: "#/components/responses/InternalServerError",

                },

            },

        },

    },



    "/api/v1/auth/login": {

        post: {

            tags: ["Authentication"],

            summary: "Login",

            description:
                "Authenticates an existing user and returns a JWT access token.",

            operationId: "loginUser",

            requestBody: {

                required: true,

                content: {

                    "application/json": {

                        schema: {

                            $ref: "#/components/schemas/LoginRequest",

                        },

                    },

                },

            },

            responses: {

                200: {

                    description: "Login successful.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref: "#/components/schemas/AuthResponse",

                            },

                        },

                    },

                },

                401: {

                    $ref: "#/components/responses/Unauthorized",

                },

                500: {

                    $ref: "#/components/responses/InternalServerError",

                },

            },

        },

    },

    "/api/v1/auth/forgot-password": {
        post: {
            tags: ["Authentication"],
            summary: "Reset Password",
            description:
                "Allows a registered user to reset their password using their email address.",
            operationId: "forgotPassword",

            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: [
                                "email",
                                "newPassword",
                                "confirmNewPassword",
                            ],
                            properties: {
                                email: {
                                    type: "string",
                                    format: "email",
                                    example: "higgs@gmail.com",
                                },
                                newPassword: {
                                    type: "string",
                                    example: "Password123",
                                },
                                confirmNewPassword: {
                                    type: "string",
                                    example: "Password123",
                                },
                            },
                        },
                    },
                },
            },

            responses: {
                200: {
                    description:
                        "Password updated successfully.",
                },
                404: {
                    $ref: "#/components/responses/NotFound",
                },
                400: {
                    $ref: "#/components/responses/BadRequest",
                },
            },
        },
    },
    "/api/v1/auth/logout": {
        post: {
            201 : {
                "success": true,
                "message": "Logged out successfully."
            },
            summary: "Logout",
            description:
                "Logs out the current user and invalidates their JWT access token.",
            operationId: "logoutUser",
        },
    },

};

export default authPaths;