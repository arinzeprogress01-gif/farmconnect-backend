import Joi from "joi";
import { FOOD_CATEGORIES } from "../constants/foodCategories.js";

const listingSchema = Joi.object({

    foodName: Joi.string()

        .trim()

        .min(2)

        .max(100)

        .required()

        .messages({

            "string.empty":
                "Food name is required.",

        }),

    category: Joi.string()

        .valid(...FOOD_CATEGORIES)

        .required()

        .messages({

            "any.only":
                "Please select a valid food category.",

        }),
    
    isFree: Joi.boolean()

        .default(false),
    
    price: Joi.when("isFree", {

        is: true,

        then: Joi.number().valid(0),

        otherwise: Joi.number().min(1).required(),

    }),

    description: Joi.string()

        .trim()

        .max(500)

        .allow(""),

    quantity: Joi.number()

        .integer()

        .min(1)

        .required()

        .messages({

            "number.base":
                "Quantity must be a number.",

        }),

    useVendorLocation: Joi.boolean()

        .default(true),

    pickupLocation: Joi.string()

        .trim()

        .when("useVendorLocation", {

            is: false,

            then: Joi.required(),

            otherwise: Joi.optional(),

        }),

    imageUrls: Joi.array()

        .items(

            Joi.string().uri()

        )

        .default([]),

    isHealthy: Joi.boolean()

        .default(true),

});

export default listingSchema;