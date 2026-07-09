import * as authService from "../services/auth.service.js";

export const registerUser = async (req, res, next) => {
    try {

        const result = await authService.register(req.body);

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};