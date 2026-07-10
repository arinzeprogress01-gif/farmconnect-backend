const responses = {
    BadRequest: {
        description: "Validation failed.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                    success: false,
                    message: "Validation failed.",
                },
            },
        },
    },

    Unauthorized: {
        description: "Authentication failed.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                    success: false,
                    message: "Invalid email or password.",
                },
            },
        },
    },

    Forbidden: {
        description: "You are not authorized to perform this action.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                    success: false,
                    message: "Access denied.",
                },
            },
        },
    },

    NotFound: {
        description: "Requested resource was not found.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                    success: false,
                    message: "Resource not found.",
                },
            },
        },
    },

    Conflict: {
        description: "Resource already exists.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                    success: false,
                    message: "Email already exists.",
                },
            },
        },
    },

    InternalServerError: {
        description: "Unexpected server error.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                    success: false,
                    message: "Internal server error.",
                },
            },
        },
    },
};

export default responses;