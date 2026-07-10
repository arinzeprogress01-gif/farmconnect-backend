import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "FarmConnect API",
            version: "1.0.0",
            description: "Backend API documentation for the FarmConnect project.",
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Development Server",
            },
            {
                url: "https://farmconnect-backend-1.onrender.com",
                description: "Production Server",
            },
        ],
    },

    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;