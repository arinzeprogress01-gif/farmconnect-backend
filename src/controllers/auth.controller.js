import * as authService from "../services/auth.service.js";

import {

    forgotPassword,

    verifyOtp,

    resetPassword,

} from "../services/auth.service.js";

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

export const loginUser = async (req, res, next) => {

    try {

        const result = await authService.login(req.body);

        return res.status(200).json({

            success: true,

            message: "Login successful.",

            data: result,

        });

    } catch (error) {

        next(error);

    }

};


export const logoutUser = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await authService.logoutUser();

        res.status(200).json(result);

    }

    catch (error) {

        next(error);

    }

};

export const forgotPasswordUser = async (

    req,

    res,

    next

) => {

    try {

        const result =

            await forgotPassword(

                req.body

            );

        res.status(200).json(result);

    }

    catch (error) {

        next(error);

    }

};

export const verifyUserOtp = async (

    req,

    res,

    next

) => {

    try {

        const result =

            await verifyOtp(

                req.body

            );

        res.status(200).json(result);

    }

    catch (error) {

        next(error);

    }

};

export const resetUserPassword = async (

    req,

    res,

    next

) => {

    try {

        const result =

            await resetPassword(

                req.body

            );

        res.status(200).json(result);

    }

    catch (error) {

        next(error);

    }

};