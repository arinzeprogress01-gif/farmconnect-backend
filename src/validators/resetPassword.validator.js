import Joi from "joi";
import { passwordRegex } from "../constants/regex.js";



const resetPasswordSchema = Joi.object({

    newPassword: Joi.string()

        .pattern(passwordRegex)

        .required()

        .min(8)

        .messages({

            "string.pattern.base":

                "Password must contain at least one uppercase letter, one lowercase letter, one number and be at least 8 characters long.",

        }),


    confirmPassword: Joi.any()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": "Passwords do not match.",
        }),

});

export default resetPasswordSchema;