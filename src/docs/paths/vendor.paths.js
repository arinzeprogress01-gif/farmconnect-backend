const vendorPaths = {

    "/api/vendors/profile": {

        post: {

            tags: ["Vendor"],

            summary: "Create Vendor Profile",

            description:
                "Allows an authenticated user with the Vendor role to create a business profile. A vendor can only create one profile.",

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

                            $ref:
                                "#/components/schemas/VendorProfileInput",

                        },

                    },

                },

            },

            responses: {

                "201": {

                    description:
                        "Vendor profile created successfully.",

                },

                "400": {

                    $ref:
                        "#/components/responses/BadRequest",

                },

                "401": {

                    $ref:
                        "#/components/responses/Unauthorized",

                },

                "403": {

                    $ref:
                        "#/components/responses/Forbidden",

                },

                "409": {

                    $ref:
                        "#/components/responses/Conflict",

                },

            },

        },

        get: {

            tags: ["Vendor"],

            summary: "Get Vendor Profile",

            description:
                "Returns the authenticated vendor's business profile.",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            responses: {

                "200": {

                    description:
                        "Vendor profile retrieved successfully.",

                },

                "401": {

                    $ref:
                        "#/components/responses/Unauthorized",

                },

                "404": {

                    $ref:
                        "#/components/responses/NotFound",

                },

            },

        },

        patch: {

            tags: ["Vendor"],

            summary: "Update Vendor Profile",

            description:
                "Updates the authenticated vendor's profile information.",

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

                            $ref:
                                "#/components/schemas/VendorProfileInput",

                        },

                    },

                },

            },

            responses: {

                "200": {

                    description:
                        "Vendor profile updated successfully.",

                },

                "400": {

                    $ref:
                        "#/components/responses/BadRequest",

                },

                "401": {

                    $ref:
                        "#/components/responses/Unauthorized",

                },

                "404": {

                    $ref:
                        "#/components/responses/NotFound",

                },

            },

        },

        delete: {

            tags: ["Vendor"],

            summary: "Delete Vendor Profile",

            description:
                "Deletes the authenticated vendor profile.",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            responses: {

                "200": {

                    description:
                        "Vendor profile deleted successfully.",

                },

                "401": {

                    $ref:
                        "#/components/responses/Unauthorized",

                },

                "404": {

                    $ref:
                        "#/components/responses/NotFound",

                },

            },

        },

    },

};

export default vendorPaths;