import Joi from "joi"
import ROLES from "../constants/roles.js"
import { passwordRegex } from "../constants/regex.js";


export const registerSchema = Joi.object({

    fullName: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .required(),

    phone: Joi.string()
        .trim()
        .required(),

    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .required()
        .messages({
            "string.pattern.base":
                "Password must contain at least 8 characters with uppercase, lowercase and number."
        }),

    confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords do not match."
        }),

    role: Joi.string()
        .valid(ROLES.USER, ROLES.VENDOR)
        .required(),

});

export const loginSchema = Joi.object({

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required()

});


export const forgotPasswordSchema = Joi.object({

    email: Joi.string()
        .email()
        .required(),

    newPassword: Joi.string()
        .pattern(passwordRegex)
        .required()
        .messages({

            "string.pattern.base":
                "Password must contain at least 8 characters, one uppercase, one lowercase and one number.",

        }),

    confirmNewPassword: Joi.any()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({

            "any.only":
                "Passwords do not match.",

        }),

});