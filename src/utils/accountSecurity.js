import User from "../models/user.models.js";

export const flagAccount = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        accountFlagged: true,
    });
};

export const lockAccount = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        accountLocked: true,
        accountFlagged: true,
    });
};

export const unlockAccount = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        accountLocked: false,
        accountFlagged: false,
    });
};