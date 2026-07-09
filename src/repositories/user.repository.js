import User from "../models/user.models.js";

const createUser = async (userData) => {
    return await User.create(userData);
};

const findUserByEmail = async (email) => {
    return await User.findOne({ email }).select("+password");
};

const findUserById = async (id) => {
    return await User.findById(id);
};

export {
    createUser,
    findUserByEmail,
    findUserById,
};