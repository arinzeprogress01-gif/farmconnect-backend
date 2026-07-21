const reservationPaths = {

    "/api/reservations": {

        post: {

            tags: ["Reservations"],

            summary: "Reserve a food listing",

            description:
                "Allows an authenticated user to reserve an available food listing. A pickup code is generated automatically and the listing quantity is reduced.",

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
                                "#/components/schemas/ReserveListingRequest",

                        },

                    },

                },

            },

            responses: {

                201: {

                    description:
                        "Reservation created successfully.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref:
                                    "#/components/schemas/ReservationResponse",

                            },

                        },

                    },

                },

                400: {
                    description: "Invalid request.",
                },

                401: {
                    description: "Unauthorized.",
                },

                404: {
                    description:
                        "Listing or user not found.",
                },

            },

        },

    },

    "/api/reservations/user": {

        get: {

            tags: ["Reservations"],

            summary:
                "Get current user's reservations",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            responses: {

                200: {

                    description:
                        "Reservations retrieved successfully.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref:
                                    "#/components/schemas/ReservationListResponse",

                            },

                        },

                    },

                },

            },

        },

    },

    "/api/reservations/vendor": {

        get: {

            tags: ["Reservations"],

            summary:
                "Get vendor reservations",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            responses: {

                200: {

                    description:
                        "Vendor reservations retrieved successfully.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref:
                                    "#/components/schemas/ReservationListResponse",

                            },

                        },

                    },

                },

            },

        },

    },

    "/api/reservations/user/history": {

        get: {

            tags: ["Reservations"],

            summary:
                "Get user's reservation history",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            responses: {

                200: {

                    description:
                        "Reservation history retrieved successfully.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref:
                                    "#/components/schemas/ReservationListResponse",

                            },

                        },

                    },

                },

            },

        },

    },

    "/api/reservations/vendor/history": {

        get: {

            tags: ["Reservations"],

            summary:
                "Get vendor reservation history",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            responses: {

                200: {

                    description:
                        "Vendor reservation history retrieved successfully.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref:
                                    "#/components/schemas/ReservationListResponse",

                            },

                        },

                    },

                },

            },

        },

    },

    "/api/reservations/{reservationId}/cancel": {

        patch: {

            tags: ["Reservations"],

            summary:
                "Cancel reservation",

            description:
                "Allows the owner vendor to cancel a reservation and restore the food quantity.",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            parameters: [

                {

                    name: "reservationId",

                    in: "path",

                    required: true,

                    schema: {

                        type: "string",

                    },

                },

            ],

            requestBody: {

                required: true,

                content: {

                    "application/json": {

                        schema: {

                            $ref:
                                "#/components/schemas/CancelReservationRequest",

                        },

                    },

                },

            },

            responses: {

                200: {

                    description:
                        "Reservation cancelled successfully.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref:
                                    "#/components/schemas/ReservationResponse",

                            },

                        },

                    },

                },

                400: {
                    description: "Invalid request.",
                },

                403: {
                    description: "Forbidden.",
                },

                404: {
                    description: "Reservation not found.",
                },

            },

        },

    },

    "/api/reservations/{reservationId}/complete": {

        patch: {

            tags: ["Reservations"],

            summary:
                "Complete reservation",

            description:
                "Allows the owner vendor to mark a reservation as completed.",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            parameters: [

                {

                    name: "reservationId",

                    in: "path",

                    required: true,

                    schema: {

                        type: "string",

                    },

                },

            ],

            responses: {

                200: {

                    description:
                        "Reservation completed successfully.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref:
                                    "#/components/schemas/ReservationResponse",

                            },

                        },

                    },

                },

                400: {
                    description: "Invalid request.",
                },

                403: {
                    description: "Forbidden.",
                },

                404: {
                    description: "Reservation not found.",
                },

            },

        },

    },

    "/api/v1/reservations/{reservationId}/user-cancel": {

        patch: {

            tags: ["Reservations"],

            summary: "Cancel Reservation (User)",

            description:
                "Allows an app user to cancel their own reservation before it is completed.",

            operationId: "userCancelReservation",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            parameters: [

                {

                    in: "path",

                    name: "reservationId",

                    required: true,

                    schema: {

                        type: "string",

                    },

                    example:
                        "68776d95cf9f12d6c2bb1234",

                },

            ],

            responses: {

                200: {

                    description:
                        "Reservation cancelled successfully.",

                },

                400: {

                    $ref:
                        "#/components/responses/BadRequest",

                },

                401: {

                    $ref:
                        "#/components/responses/Unauthorized",

                },

                404: {

                    $ref:
                        "#/components/responses/NotFound",

                },

            },

        },

    },

};



export default reservationPaths;