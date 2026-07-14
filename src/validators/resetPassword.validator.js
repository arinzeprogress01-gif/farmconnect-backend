import Joi from "joi";
import { passwordRegex } from "../constants/regex.js";

const resetPasswordSchema = Joi.object({

    email: Joi.string()

        .email()

        .required(),

    otp: Joi.string()

        .length(6)

        .pattern(/^[0-9]+$/)

        .required(),

    newPassword: Joi.string()

        .pattern(passwordRegex)

        .required()
        
        .messages({

            "string.pattern.base":

                "Password must contain at least one uppercase letter, one lowercase letter, one number and be at least 8 characters long.",

        }),

        

    confirmNewPassword: Joi.any()

        .valid(Joi.ref("newPassword"))

        .required()

        .messages({

            "any.only":

                "Passwords do not match.",

        }),

});

export default resetPasswordSchema;