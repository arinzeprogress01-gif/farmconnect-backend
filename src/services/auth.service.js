import {
    createUser,
    findUserByEmail,
} from "../repositories/user.repository.js";


import { UnauthorizedError } from "../errors/unauthorized-error.js";

import { ConflictError } from "../errors/conflict-error.js";

import {
    createVendorProfile,
} from "../repositories/vendor-profile.repository.js";

import { hashPassword, comparePassword } from "../utils/password.utils.js";

import { generateToken } from "../utils/jwt.utils.js";

import { ROLES } from "../constants/roles.js";


const register = async (payload) => {

        const {
            fullName,
            email,
            password,
            phone,
            role,
        } = payload;


    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new ConflictError("Email already exists.");
    };

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
        throw new UnauthorizedError("Invalid email or password.");
    }

    const passwordMatch = await comparePassword(
        password,
        user.password
    );

    if (!passwordMatch) {
        throw new UnauthorizedError("Invalid email or password.");
    }

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