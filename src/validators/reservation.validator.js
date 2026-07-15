import Joi from "joi";

const reservationSchema = Joi.object({

    listingId: Joi.string()
        .required(),

    quantityRequested: Joi.number()
        .min(1)
        .required(),

});

export default reservationSchema;