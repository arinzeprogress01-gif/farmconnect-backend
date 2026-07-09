const User = require("../models/user.model");

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