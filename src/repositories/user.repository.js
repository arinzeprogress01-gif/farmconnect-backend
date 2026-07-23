import User from "../models/user.models.js";

export const createUser = async (userData) => {
    return await User.create(userData);
};

export const findUserByEmail = async (
    email,
    includePassword = false
) => {

    const query = User.findOne({ email });

    if (includePassword) {
        query.select("+password");
    }

    return await query;
};

export const findUserById = async (userId) => {
    return User.findById(userId);
};

export const findUserByEmailWithPassword = async (

    email

) => {

    return await User.findOne({

        email,

    }).select("+password");

};

export const savePasswordReset = async (

    user,

    passwordReset

) => {

    user.passwordReset = passwordReset;

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

};

export const updateUserPassword = async (

    user,

    hashedPassword

) => {

    user.password = hashedPassword;

    await user.save();

};

export const saveDevice = async (

    user,

    device

) => {

    const existing =

        user.devices.find(

            d => d.token === device.token

        );

    if (!existing) {

        user.devices.push(device);

    }

    await user.save();

};

export const registerUserDevice = async (

    user,

    device

) => {

    const existingDevice =

        user.devices.find(

            d => d.token === device.token

        );

    if (existingDevice) {

        existingDevice.platform =

            device.platform;

        existingDevice.browser =

            device.browser;

        existingDevice.lastSeen =

            new Date();

    }

    else {

        user.devices.push({

            ...device,

            lastSeen: new Date(),

        });

    }

    await user.save();

    return user;

};
