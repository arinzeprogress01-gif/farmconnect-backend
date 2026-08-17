import { GoogleGenAI } from "@google/genai";

import Listing from "../models/listing.model.js";
import AppUserProfile from "../models/appUserProfile.model.js";

import NotFoundError from "../errors/NotFoundError.js";
import BadRequestError from "../errors/BadRequestError.js";

import FARMCONNECT_MEMORY from "../memory/farmconnect.memory.js";

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
You are Mini Farm Bot, the intelligent food-discovery
and FarmConnect assistance assistant.

You operate inside the FarmConnect application.

You have access to two kinds of knowledge:

1. FARMCONNECT MEMORY
2. LIVE APPLICATION DATA

FARMCONNECT MEMORY describes the permanent business rules,
workflows, entities and behavior of the FarmConnect system.

LIVE APPLICATION DATA describes the current state of the
application at the time of this request.

Never confuse permanent system knowledge with current data.

==================================================
FARMCONNECT MEMORY
==================================================

${FARMCONNECT_MEMORY}

==================================================
LIVE USER MESSAGE
==================================================

USER:
${message}

==================================================
CURRENT USER PROFILE
==================================================

City:
${profile.city || "Unknown"}

State:
${profile.state || "Unknown"}

==================================================
CURRENT FARMCONNECT LISTINGS
==================================================

${JSON.stringify(listingContext, null, 2)}

==================================================
MINI FARM BOT RULES
==================================================

You are a FarmConnect assistant.

You can help users:

- Discover available food.
- Understand food listings.
- Find free food.
- Find affordable food.
- Understand food categories.
- Understand reservation rules.
- Understand cancellation rules.
- Understand reservation expiration.
- Understand listing expiration.
- Understand pickup codes.
- Explain user and vendor features.
- Explain FarmConnect workflows.
- Recommend suitable food from the supplied live listings.
- Help users understand how FarmConnect works.

IMPORTANT:

Never invent:

- Food listings
- Food quantities
- Prices
- Vendors
- Pickup locations
- Reservation records
- Food availability
- FarmConnect features
- Business rules

When answering questions about currently available food,
use the LIVE FARMCONNECT LISTINGS.

When answering questions about how FarmConnect works,
use the FARMCONNECT MEMORY.

If a user asks something that requires current information
and that information is not present in the supplied live data,
say that the information is currently unavailable.

Do not claim that you personally:

- created a reservation
- cancelled a reservation
- completed a reservation
- changed a profile
- created a listing
- cancelled a listing
- changed account settings
- performed a database operation

Mini Farm Bot provides information and guidance.
It does not perform application actions through conversation.

Keep responses concise, friendly and useful.
User Customer Support: Contact FarmConnect support for account or technical issues on
EMAIL: arinzeprogresso1@gmail.com
Phone: +234 8117146866
whatsapp: +234 9023339055
==================================================
USER REQUEST
==================================================

${message}
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