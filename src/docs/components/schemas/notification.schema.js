const notificationSchemas = {

    Notification: {

        type: "object",

        properties: {

            _id: {

                type: "string",

                example: "6876a4b3e31dcbdbb4b88f91",

            },

            receiver: {

                type: "string",

                example: "6876a2e8e31dcbdbb4b88e72",

            },

            title: {

                type: "string",

                example: "Reservation Successful",

            },

            message: {

                type: "string",

                example:
                    "Your reservation has been created successfully.",

            },

            type: {

                type: "string",

                enum: [

                    "reservation",

                    "listing",

                    "account",

                    "system",

                    "reminder",

                ],

            },

            priority: {

                type: "string",

                enum: [

                    "low",

                    "medium",

                    "high",

                ],

            },

            data: {

                type: "object",

                additionalProperties: true,

            },

            isRead: {

                type: "boolean",

                example: false,

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

    NotificationResponse: {

        type: "object",

        properties: {

            success: {

                type: "boolean",

                example: true,

            },

            message: {

                type: "string",

                example: "Notification retrieved successfully.",

            },

            notification: {

                $ref:
                    "#/components/schemas/Notification",

            },

        },

    },

    NotificationListResponse: {

        type: "object",

        properties: {

            success: {

                type: "boolean",

                example: true,

            },

            count: {

                type: "number",

                example: 8,

            },

            notifications: {

                type: "array",

                items: {

                    $ref:
                        "#/components/schemas/Notification",

                },

            },

        },

    },

};

export default notificationSchemas;