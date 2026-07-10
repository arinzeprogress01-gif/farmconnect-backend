const securitySchemes = {

    bearerAuth: {

        type: "http",

        scheme: "bearer",

        bearerFormat: "JWT",

        description:
            "Enter your JWT token in the format: Bearer <token>",

    },

};

export default securitySchemes;