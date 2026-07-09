import Joi from "joi"
import ROLES from "../constants/roles.js"

export const registerSchema = Joi.object({
    fullName: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required(),

    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .required()
        .messages({
            "string.pattern.base":
                "Password must contain at least 8 characters with uppercase, lowercase and a number."
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

    phone: Joi.string()
        .trim()
        .required(),

    businessName: Joi.when("role", {
        is: "vendor",
        then: Joi.string().trim().required(),
        otherwise: Joi.optional()
    }),

    businessType: Joi.when("role", {
        is: "vendor",
        then: Joi.string().trim().required(),
        otherwise: Joi.optional()
    }),

    address: Joi.when("role", {
        is: "vendor",
        then: Joi.string().trim().required(),
        otherwise: Joi.optional()
    })
});

export const loginSchema = Joi.object({

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required()

});


