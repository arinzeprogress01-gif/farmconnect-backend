import OpenAI from "openai";

import Listing from "../models/listing.model.js";
import AppUserProfile from "../models/appUserProfile.model.js";

import NotFoundError from "../errors/NotFoundError.js";
import BadRequestError from "../errors/BadRequestError.js";

const getOpenAIClient = () => {

    if (!process.env.OPENAI_API_KEY) {

        throw new BadRequestError(
            "AI service is not configured."
        );

    }

    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

};

export const askFarmConnectAI = async (
    userId,
    message
) => {

    const openai = getOpenAIClient();

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
            expiresAt: {
                $gt: new Date(),
            },
        })
            .populate(
                "vendorId",
                "businessName"
            )
            .limit(50)
            .lean();

    const listingContext =
        listings.map((listing) => ({
            foodName:
                listing.foodName,

            category:
                listing.category,

            price:
                listing.price,

            isFree:
                listing.isFree,

            quantity:
                listing.quantity,

            pickupLocation:
                listing.pickupLocation,

            vendor:
                listing.vendorId?.businessName ||
                "Unknown vendor",

            status:
                listing.status,

            expiresAt:
                listing.expiresAt,
        }));

    const response =
        await openai.responses.create({

            model: "gpt-5-mini",

            instructions: `
You are the FarmConnect AI assistant.

FarmConnect is a food-sharing marketplace that helps users
discover and reserve affordable or free meals.

Your job is to help users find meals and understand
FarmConnect listings.

Only recommend listings that appear in the supplied
listing data.

Never invent:
- food listings
- vendors
- prices
- quantities
- locations
- availability

If a user asks for meals near them, use the supplied
pickup locations and user location when possible.

If there are no suitable listings, clearly say so.

Keep responses concise, friendly and useful.

Do not claim that you completed a reservation.
The user must use the FarmConnect reservation interface
to reserve food.
`,

            input: `
USER LOCATION:

${JSON.stringify(
                profile.location || null
            )}

USER MESSAGE:

${message}

CURRENT FARMCONNECT LISTINGS:

${JSON.stringify(
                listingContext,
                null,
                2
            )}
`,
        });

    return {
        message:
            response.output_text,
    };
};