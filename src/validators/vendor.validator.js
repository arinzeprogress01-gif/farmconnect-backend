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

    profileImage: Joi.string()
        .allow("")
        .optional(),

    operatingHours: Joi.string()
        .allow("")
        .optional(),

});

export default vendorProfileSchema;