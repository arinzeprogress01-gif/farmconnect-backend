import User from "../models/user.models.js";


export const updatePasswordReset = async (

    user,

    passwordReset

) => {

    user.passwordReset = passwordReset;

    await user.save();

    return user;

};

export const updatePassword = async (

    user,

    hashedPassword

) => {

    user.password = hashedPassword;

    await user.save();

    return user;

};

export const clearPasswordReset = async (

    user

) => {

    user.passwordReset = {

        otpHash: null,

        expiresAt: null,

        attempts: 0,

        verified: false,

        createdAt: null,

    };

    await user.save();

    return user;

};

export const incrementPasswordResetAttempts = async (

    user

) => {

    user.passwordReset.attempts += 1;

    await user.save();

    return user;

};

export const markPasswordResetVerified = async (

    user

) => {

    user.passwordReset.verified = true;

    user.passwordReset.attempts = 0;

    await user.save();

    return user;

};