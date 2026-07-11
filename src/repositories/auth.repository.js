import User from "../models/user.models.js";

export const updatePassword = async (userId, hashedPassword) => {

    return await User.findByIdAndUpdate(

        userId,

        {

            password: hashedPassword,

        },

        {

            new: true,

        }

    );

};