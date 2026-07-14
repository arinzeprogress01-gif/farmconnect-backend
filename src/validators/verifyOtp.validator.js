import Joi from "joi";

const verifyOtpSchema = Joi.object({

    email: Joi.string()

        .email()

        .required(),

    otp: Joi.string()

        .length(6)

        .required()

        .pattern(/^\d+$/)

        .messages({

            "string.length":

                "OTP must contain 6 digits.",

        }),

});

export default verifyOtpSchema;