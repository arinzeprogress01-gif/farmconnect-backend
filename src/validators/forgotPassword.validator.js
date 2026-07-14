import Joi from "joi";

const forgotPasswordSchema = Joi.object({

    email: Joi.string()

        .email()

        .required()

        .messages({

            "string.email":

                "Please provide a valid email address.",

            "any.required":

                "Email is required.",

        }),

});

export default forgotPasswordSchema;