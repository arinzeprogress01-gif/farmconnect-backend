const appUserProfilePaths = {

    "/api/users/profile": {

        post: {

            tags: ["Users"],

            summary: "Create User Profile",

            description:
                "Allows an authenticated user to create their personal profile. A user can only create one profile.",

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
                                "#/components/schemas/AppUserProfileInput",

                        },

                    },

                },

            },

            responses: {

                "201": {

    description:
        "User profile created successfully.",

    content: {

        "application/json": {

            schema: {

                $ref:
                    "#/components/schemas/AppUserProfileResponse",

            },

        },

    },

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

            tags: ["Users"],

            summary: "Get User Profile",

            description:
                "Returns the authenticated user's profile.",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            responses: {

                "200": {

            description:
                "User profile retrieved successfully.",

            content: {

                "application/json": {

                    schema: {

                        $ref:
                            "#/components/schemas/AppUserProfileResponse",

                    },

                },

            },

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

            tags: ["Users"],

            summary: "Update User Profile",

            description:
                "Updates the authenticated user's profile.",

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
                                "#/components/schemas/AppUserProfileInput",

                        },

                    },

                },

            },

            responses: {

"200": {

    description:
        "User profile updated successfully.",

    content: {

        "application/json": {

            schema: {

                $ref:
                    "#/components/schemas/AppUserProfileResponse",

            },

        },

    },

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

            tags: ["Users"],

            summary: "Delete User Profile",

            description:
                "Deletes the authenticated user's profile.",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            responses: {

                "200": {

                    description:
                        "User profile deleted successfully.",

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

export default appUserProfilePaths;