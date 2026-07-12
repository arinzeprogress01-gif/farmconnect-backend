import {
    createUser,
    findUserByEmail,
} from "../repositories/user.repository.js";

import { updatePassword } from "../repositories/auth.repository.js";


import { UnauthorizedError } from "../errors/unauthorized-error.js";

import { AppError } from "../errors/app.error.js";

import { ConflictError } from "../errors/conflict-error.js";

import {
    createVendorProfile,
} from "../repositories/vendor-profile.repository.js";

import { hashPassword, comparePassword } from "../utils/password.utils.js";

import { generateToken } from "../utils/jwt.utils.js";




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
        throw new UnauthorizedError("Email is Invalid")
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
        throw new UnauthorizedError("Email is Invalid")
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

export const forgotPassword = async ({
    email,
    newPassword,
}) => {

    const user = await findUserByEmail(email);

    if (!user) {

        throw new AppError(
            "User not found.",
            404
        );

    }

    const hashedPassword =
        await hashPassword(newPassword);

    await updatePassword(
        user._id,
        hashedPassword
    );

    return {

        success: true,

        message:
            "Password updated successfully.",

    };

};

export const logoutUser = async () => {

    return {

        success: true,

        message: "Logged out successfully.",

    };

};