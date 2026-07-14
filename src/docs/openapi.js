import schemas from "./components/schemas.js";
import responses from "./components/responses.js";
import securitySchemes from "./components/security.js";
import vendorProfileSchema from "./components/schemas/vendorProfile.schema.js";
import vendorPaths from "./paths/vendor.paths.js";

import appUserProfilePaths from "./paths/appUserProfile.paths.js";

import appUserProfileSchemas from "./components/schemas/appUserProfile.schema.js";

import appUserProfileResponseSchemas from "./components/schemas/appUserProfileResponse.schema.js";

import listingSchemas from "./components/schemas/listing.schema.js";

import { listingPaths } from "./paths/listing.paths.js";

import authPaths from "./paths/auth.paths.js";

import deviceSchemas from "./components/schemas/device.schema.js";

import devicePaths from "./paths/device.paths.js";

import tags from "./tags.js";

const openapi = {

    openapi: "3.0.3",

    info: {

        title: "FoodShare API",

        version: "1.0.0",

        description:
            `
FoodShare Backend API

A scalable REST API that connects food vendors with nearby users to reduce food waste through reservations and scheduled pickups.

This API is developed using:

• Node.js

• Express.js

• MongoDB

• JWT Authentication

• Joi Validation

• Repository-Service-Controller Architecture
`,

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

    tags,

    paths: {

        ...authPaths,
        ...vendorPaths,
        ...listingPaths,
        ...appUserProfilePaths,
        ...devicePaths,

    },

    components: {

        schemas: {
            ...schemas,
            ...vendorProfileSchema,
            ...listingSchemas,
            ...appUserProfileSchemas,
            ...appUserProfileResponseSchemas,
            ...deviceSchemas,
        },

        responses,

        securitySchemes,

    },

};

export default openapi;