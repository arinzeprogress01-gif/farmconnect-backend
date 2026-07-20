import Joi from "joi";

const appUserProfileSchema = Joi.object({

    fullName: Joi.string().trim().required(),

    phone: Joi.string().trim().required(),

    profileImage: Joi.string().allow("").optional(),

    gender: Joi.string()

        .valid(

            "male",

            "female",

            "prefer_not_to_say"

        )

        .optional(),

    dateOfBirth: Joi.date().optional(),

    address: Joi.string().trim().optional(),

    city: Joi.string().trim().optional(),

    state: Joi.string().trim().optional(),

    preferredFoodCategories: Joi.array()

        .items(Joi.string())

        .optional(),

    bio: Joi.string()

        .max(300)

        .optional(),

});

export default appUserProfileSchema;