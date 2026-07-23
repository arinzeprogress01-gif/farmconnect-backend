import AppUserProfile from "../models/appUserProfile.model.js";

export const createAppUserProfile = async (

    data

) => {

    return await AppUserProfile.create(data);

};

export const findAppUserByUserId = async (

    userId

) => {

    return await AppUserProfile.findOne({

        userId,

    });

};

export const updateAppUserProfile = async (

    userId,

    updateData

) => {

    return await AppUserProfile.findOneAndUpdate(

        {

            userId,

        },

        updateData,

        {

            returnDocument: "after",

            runValidators: true,

        }

    );

};

export const deleteAppUserProfile = async (

    userId

) => {

    return await AppUserProfile.findOneAndDelete({

        userId,

    });

};