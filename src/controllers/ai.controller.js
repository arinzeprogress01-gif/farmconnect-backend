import {
    askFarmConnectAI,
} from "../services/ai.service.js";

export const askAI = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await askFarmConnectAI(
                req.user._id,
                req.body.message
            );

        res.status(200).json({

            success: true,

            message:
                "AI response generated successfully.",

            data: result,

        });

    } catch (error) {

        next(error);

    }

};