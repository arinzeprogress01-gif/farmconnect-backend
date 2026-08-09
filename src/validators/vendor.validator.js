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
    
    location: Joi.object({
        type: Joi.string()
            .valid("Point")
            .required(),

        coordinates: Joi.array()
            .items(Joi.number())
            .length(2)
            .required()
            .custom((coordinates, helpers) => {
                const [longitude, latitude] = coordinates;

                if (longitude < -180 || longitude > 180) {
                    return helpers.error("any.invalid");
                }

                if (latitude < -90 || latitude > 90) {
                    return helpers.error("any.invalid");
                }

                return coordinates;
            }),
    })
        .required()
        .messages({
            "any.required": "Location is required.",
            "any.invalid": "Invalid geographic coordinates.",
        }),

    operatingHours: Joi.string()
        .allow("")
        .optional(),

});

export default vendorProfileSchema;