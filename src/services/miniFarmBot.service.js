import { GoogleGenAI } from "@google/genai";

import Listing from "../models/listing.model.js";
import AppUserProfile from "../models/appUserProfile.model.js";

import NotFoundError from "../errors/NotFoundError.js";
import BadRequestError from "../errors/BadRequestError.js";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const askMiniFarmBot = async (
    userId,
    message
) => {

    if (!message?.trim()) {

        throw new BadRequestError(
            "Message is required."
        );

    }

    const profile =
        await AppUserProfile.findOne({
            userId,
        });

    if (!profile) {

        throw new NotFoundError(
            "User profile not found."
        );

    }

    const listings =
        await Listing.find({

            status: {
                $in: [
                    "available",
                    "pendingCompletion",
                ],
            },

            isActive: true,

            quantity: {
                $gt: 0,
            },

        })
        .populate(
            "vendorId",
            "businessName"
        )
        .limit(20);

    const listingContext =
        listings.map((listing) => ({

            foodName:
                listing.foodName,

            category:
                listing.category,

            quantity:
                listing.quantity,

            isFree:
                listing.isFree,

            price:
                listing.price,

            pickupLocation:
                listing.pickupLocation,

            vendor:
                listing.vendorId?.businessName,

            status:
                listing.status,

        }));

    const prompt = `
You are Mini Farm Bot, a helpful food-discovery
assistant inside the FarmConnect application.

FarmConnect connects users with food listings
available from vendors.

Your job is to help users:

- Discover available food.
- Understand food listings.
- Find free or affordable meals.
- Understand reservation-related questions.
- Recommend suitable meals from the listings provided.
- Explain FarmConnect features simply.
- Help users make sensible choices.

Do not invent listings, prices, vendors,
quantities, locations, or FarmConnect features.

If the requested information is not contained
in the supplied data, clearly say that you don't
have that information.

Keep responses concise, friendly and useful.
Do not claim that you personally completed a
reservation.

USER:
${message}

USER PROFILE:
City: ${profile.city || "Unknown"}
State: ${profile.state || "Unknown"}

CURRENT FARMCONNECT LISTINGS:
${JSON.stringify(listingContext, null, 2)}
`;

    try {

        const response =
            await ai.models.generateContent({

                model:
                    "gemini-3.6-flash",

                contents:
                    prompt,

            });

        const reply =
            response.text;

        return {

            reply:
                reply ||
                "Sorry, I couldn't generate a response right now.",

        };

    } catch (error) {

        console.error(
            "Mini Farm Bot Error:",
            error
        );

        throw new BadRequestError(
            "Mini Farm Bot is temporarily unavailable."
        );

    }

};