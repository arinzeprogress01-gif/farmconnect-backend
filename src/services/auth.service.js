import bcrypt from "bcrypt";

import sendNotification  from "../utils/sendNotification.js";

import {
    createUser,
    findUserByEmail,
} from "../repositories/user.repository.js";

import {

    updatePasswordReset,

    updatePassword,

    incrementPasswordResetAttempts,

    markPasswordResetVerified,

    clearPasswordReset,

} from "../repositories/auth.repository.js";


import { UnauthorizedError } from "../errors/unauthorized-error.js";
import BadRequestError from "../errors/BadRequestError.js";


import { AppError } from "../errors/app.error.js";

import { ConflictError } from "../errors/conflict-error.js";

import { hashPassword, comparePassword } from "../utils/password.utils.js";

import { generateToken } from "../utils/jwt.utils.js";


//-------------------------------------------------------



import generateOTP from "../utils/generateOtp.js";

import forgotPasswordSchema from "../validators/forgotPassword.validator.js";

import verifyOtpSchema from "../validators/verifyOtp.validator.js";

import resetPasswordSchema from "../validators/resetPassword.validator.js";

import {

    sendPushNotification,

} from "./notifications.service.js";

import {

    sendResetEmail,

} from "./email.service.js";



export const register = async (payload) => {

        const {
            fullName,
            email,
            password,
            confirmPassword,
            phone,
            role,
        } = payload;


    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new ConflictError("Email already exists.");
    };

    if (!email) {
        throw new BadRequestError("Email is required");
    };

    if(password != confirmPassword) {
        throw new ConflictError("Passwords do not match.");
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser({
        fullName,
        email,
        password: hashedPassword,
        phone,
        role,
    });

    await sendNotification({

        receiver: user._id,

        title: "Welcome to FarmConnect",

        message:
            "Welcome! Your account has been created successfully.",

        type: "system",

        priority: "medium",

        data: {

            action: "OPEN_HOME",

        },

    });

    const token = generateToken({

        id: user._id,

        role: user.role,

    });

    return {

        user: {

            id: user._id,

            fullName: user.fullName,

            email: user.email,

            phone: user.phone,

            role: user.role,

        },

        token,

    };

};

export const login = async ({ email, password }) => {

    const user = await findUserByEmail(email, true);

    if (!user) {
        throw new UnauthorizedError("User Does Not Exist");
    };

    if(!email) {
        throw new BadRequestError("Email is required");
    };

    const passwordMatch = await comparePassword(
        password,
        user.password
    );

    if (!passwordMatch) {
        throw new UnauthorizedError("Invalid password.");
    }

    const token = generateToken({
        id: user._id,
        role: user.role,
        permissions: user.permissions,
        isSuperAdmin: user.isSuperAdmin,
    });

    return {

        user: {

            id: user._id,

            fullName: user.fullName,

            email: user.email,

            phone: user.phone,

            role: user.role,

            profileCompleted: user.profileCompleted,

            permissions: user.permissions,

            isSuperAdmin: user.isSuperAdmin,

        },

        token,

    };

};

export const forgotPassword = async (

    body

) => {

    const { error, value } =

        forgotPasswordSchema.validate(body);

    if (error) {

        throw new BadRequestError(

            error.details[0].message

        );

    }

    const { email } = value;

    const user = await findUserByEmail(

        email,

        true

    );

    /*
        Do not reveal whether
        the email exists.
    */

    if (!user) {

        return {

            message:
                "If an account exists, an OTP has been sent.",

        };

    }

    const otp = generateOTP();

    const otpHash = await bcrypt.hash(

        otp,

        10

    );

    await updatePasswordReset(

        user,

        {

            otpHash,

            expiresAt:

                new Date(

                    Date.now() +

                    5 * 60 * 1000

                ),

            attempts: 0,

            verified: false,

            createdAt: new Date(),

        }

    );

    if (

        user.devices.length > 0

    ) {

        await sendPushNotification({

            tokens:

                user.devices.map(

                    d => d.token

                ),

            title:

                "FarmConnect",

            body:

                `Your password reset code is ${otp}. It expires in 5 minutes.`,

            data: {

                type:

                    "PASSWORD_RESET",

                email:

                    user.email,

            },

        });

    }

    /*
        Future Email Support
    */

    await sendResetEmail(

        user.email,

        otp

    );

    await sendNotification({

        receiver: user._id,

        title: "Password Reset Requested",

        message:
            "A password reset request was initiated for your account.",

        type: "security",

        priority: "high",

        data: {

            action: "OPEN_PROFILE",

        },

    });

    return {

        message:
            "If an account exists, an OTP has been sent.",

    };

};

export const verifyOtp = async (

    body

) => {

    const { error, value } =

        verifyOtpSchema.validate(body);

    if (error) {

        throw new BadRequestError(

            error.details[0].message

        );

    }

    const {

        email,

        otp,

    } = value;

    const user =

        await findUserByEmail(

            email,

            true

        );

    if (!user) {

        throw new UnauthorizedError(

            "Invalid OTP."

        );

    }

    if (

        !user.passwordReset.otpHash

    ) {

        throw new UnauthorizedError(

            "OTP has not been generated."

        );

    }

    if (

        user.passwordReset.expiresAt <

        new Date()

    ) {

        throw new UnauthorizedError(

            "OTP has expired."

        );

    }

    if (

        user.passwordReset.attempts >= 5

    ) {

        throw new UnauthorizedError(

            "Too many attempts. Request another OTP."

        );

    }

    const valid =

        await bcrypt.compare(

            otp,

            user.passwordReset.otpHash

        );

    if (!valid) {

        await incrementPasswordResetAttempts(

            user

        );

        throw new UnauthorizedError(

            "Invalid OTP."

);

    }

        await markPasswordResetVerified(

            user

        );

    await sendNotification({

        receiver: user._id,

        title: "OTP Verified",

        message:
            "Your password reset OTP has been verified successfully.",

        type: "security",

        priority: "medium",

        data: {

            action: "OPEN_PROFILE",

        },

    });

    return {

        message:

            "OTP verified successfully.",

    };

};

export const resetPassword = async (

    body

) => {

    const { error, value } =

        resetPasswordSchema.validate(body);

    if (error) {

        throw new BadRequestError(

            error.details[0].message

        );

    }

    const {

        email,

        newPassword,

    } = value;

    const user =

        await findUserByEmail(

            email,

            true

        );

    if (!user) {

        throw new UnauthorizedError(

            "Invalid request."

        );

    }

    if (

        !user.passwordReset.verified

    ) {

        throw new UnauthorizedError(

            "OTP verification is required."

        );

    }

    const hashedPassword =

        await bcrypt.hash(

            newPassword,

            10

        );

    await updatePassword(

        user,

        hashedPassword

    );

    await clearPasswordReset(

        user

    );

    await sendNotification({

        receiver: user._id,

        title: "Password Changed",

        message:
            "Your password has been changed successfully.",

        type: "security",

        priority: "high",

        data: {

            action: "OPEN_PROFILE",

        },

    });

    return {

        message:

            "Password reset successfully.",

    };

};


export const logoutUser = async () => {

    return {

        success: true,

        message: "Logged out successfully.",

    };

};