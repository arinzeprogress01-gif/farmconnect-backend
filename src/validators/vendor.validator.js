import Joi from "joi";

const vendorProfileSchema = Joi.object({

    businessName: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required(),

    businessType: Joi.string()
        .trim()
        .required(),

    description: Joi.string()
        .allow("")
        .optional(),

    email: Joi.string()
        .email()
        .required(),

    phone: Joi.string()
        .trim()
        .required(),

    permanentAddress: Joi.string()
        .trim()
        .required(),

    currentLocation: Joi.string()
        .trim()
        .required(),
    
    state: Joi.string()
        .trim()
        .required(),

    city: Joi.string()
        .trim()
        .required(),

    profileImage: Joi.string()
        .uri()
        .required()
        .messages({
            "string.uri": "Please upload a valid profile image.",
            "any.required": "Vendor profile image is required."
        }),
    
    latitude: Joi.number()
        .min(-90)
        .max(90)
        .required()
        .messages({
            "number.base": "Latitude must be a number.",
            "number.min": "Latitude must be between -90 and 90.",
            "number.max": "Latitude must be between -90 and 90.",
        }),

    longitude: Joi.number()
        .min(-180)
        .max(180)
        .required()
        .messages({
            "number.base": "Longitude must be a number.",
            "number.min": "Longitude must be between -180 and 180.",
            "number.max": "Longitude must be between -180 and 180.",
        }),

    operatingHours: Joi.string()
        .allow("")
        .optional(),

});

export default vendorProfileSchema;