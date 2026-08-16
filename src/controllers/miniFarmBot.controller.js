import {
    askMiniFarmBot,
} from "../services/miniFarmBot.service.js";

export const miniFarmBot = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await askMiniFarmBot(
                req.user._id,
                req.body.message
            );

        return res.status(200).json({

            success: true,

            message:
                "Mini Farm Bot response generated successfully.",

            data: result,

        });

    } catch (error) {

        next(error);

    }

};