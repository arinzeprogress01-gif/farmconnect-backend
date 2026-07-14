import Joi from "joi";

const deviceSchema = Joi.object({

    token: Joi.string()

        .required()

        .messages({

            "any.required":
                "Device token is required.",

        }),

    platform: Joi.string()

        .valid(

            "web",

            "android",

            "ios"

        )

        .default("web"),

    browser: Joi.string()

        .default("Unknown"),

});

export default deviceSchema;