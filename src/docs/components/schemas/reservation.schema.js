const reservationSchemas = {
    Reservation: {
        type: "object",
        properties: {
            _id: {
                type: "string",
                example: "6876a4b3e31dcbdbb4b88f91",
            },
            reservationId: {
                type: "string",
                example: "RSV-20260717-0001",
            },
            pickupCode: {
                type: "string",
                example: "483921",
            },
            listing: {
                type: "string",
                example: "6876a43ee31dcbdbb4b88f61",
            },
            vendor: {
                type: "string",
                example: "6876a51ce31dcbdbb4b89111",
            },
            user: {
                type: "string",
                example: "6876a2e8e31dcbdbb4b88e72",
            },
            foodName: {
                type: "string",
                example: "Jollof Rice",
            },
            category: {
                type: "string",
                example: "Cooked Meals",
            },
            pickupLocation: {
                type: "string",
                example: "Awka, Anambra",
            },
            quantityRequested: {
                type: "number",
                example: 2,
            },
            status: {
                type: "string",
                enum: [
                    "reserved",
                    "completed",
                    "cancelled",
                ],
            },
            cancellationReason: {
                type: "string",
                example: "Restaurant closed early.",
            },
            completedAt: {
                type: "string",
                format: "date-time",
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

    ReserveListingRequest: {
        type: "object",
        required: [
            "listingId",
            "quantityRequested",
        ],
        properties: {
            listingId: {
                type: "string",
                example: "LST-20260717-0003",
            },
            quantityRequested: {
                type: "number",
                example: 2,
            },
        },
    },

    CancelReservationRequest: {
        type: "object",
        required: [
            "cancellationReason",
        ],
        properties: {
            cancellationReason: {
                type: "string",
                example: "Food spoilt before pickup.",
            },
        },
    },

    ReservationResponse: {
        type: "object",
        properties: {
            success: {
                type: "boolean",
                example: true,
            },
            message: {
                type: "string",
                example: "Reservation processed successfully.",
            },
            reservation: {
                $ref: "#/components/schemas/Reservation",
            },
        },
    },

    ReservationListResponse: {
        type: "object",
        properties: {
            success: {
                type: "boolean",
                example: true,
            },
            count: {
                type: "number",
                example: 5,
            },
            reservations: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/Reservation",
                },
            },
        },
    },
};

export default reservationSchemas;