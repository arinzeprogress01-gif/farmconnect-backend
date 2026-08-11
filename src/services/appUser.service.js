import appUserProfileSchema from "../validators/appUser.validator.js";
import  sendNotification  from "../utils/sendNotification.js";

import AppUserProfile from "../models/appUserProfile.model.js";

import { isValidCoordinates } from "../utils/geoLocation.js";

import { findUserById } from "../repositories/user.repository.js";

import {
    createAppUserProfile,
    findAppUserByUserId,
    updateAppUserProfile,
    deleteAppUserProfile,
} from "../repositories/appUser.repository.js";

import BadRequestError from "../errors/BadRequestError.js";
import { ConflictError } from "../errors/conflict-error.js";
import NotFoundError from "../errors/NotFoundError.js";
import ForbiddenError from "../errors/ForbiddenError.js";

import { ROLES } from "../constants/roles.js";

export const createUserProfile = async (

    userId,

    profileData

) => {

    const { error, value } =

        appUserProfileSchema.validate(

            profileData

        );

    if (error) {

        throw new BadRequestError(

            error.details[0].message

        );

    }

    const user = await findUserById(userId);

    if (!user) {

        throw new NotFoundError(

            "User not found."

        );

    }

    if (user.role !== ROLES.USER) {

        throw new ForbiddenError(

            "Only users can create a profile."

        );

    }

    const existingProfile =

        await findAppUserByUserId(

            userId

        );

    if (existingProfile) {

        throw new ConflictError(

            "User profile already exists."

        );

    }

    const profile = await createAppUserProfile({
        userId,
        fullName: user.fullName,
        phone: user.phone,
        ...value,
    });

    user.profileCompleted = true;

    await user.save();

    await sendNotification({

        receiver: user._id,

        title: "Profile Created",

        message:
            "Your profile has been created successfully.",

        type: "system",

        priority: "low",

    });

    return profile;

};

export const getUserProfile = async (

    userId

) => {

    const profile =

        await findAppUserByUserId(

            userId

        );

    if (!profile) {

        throw new NotFoundError(

            "User profile not found."

        );

    }

    return profile;

};

export const updateUserProfile = async (

    userId,

    profileData

) => {

    const profile =

        await findAppUserByUserId(

            userId

        );

    if (!profile) {

        throw new NotFoundError(

            "User profile not found."

        );

    }

    return await updateAppUserProfile(

        userId,

        profileData

    );

};

export const updateAppUserLocationService = async (
    userId,
    longitude,
    latitude
) => {
    if (
        !isValidCoordinates(
            longitude,
            latitude
        )
    ) {
        throw new BadRequestError(
            "Invalid location coordinates."
        );
    }

    const profile =
        await AppUserProfile.findOneAndUpdate(
            { userId },
            {
                $set: {
                    location: {
                        type: "Point",
                        coordinates: [
                            Number(longitude),
                            Number(latitude),
                        ],
                    },
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

    if (!profile) {
        throw new NotFoundError(
            "User profile not found."
        );
    }

    return profile;
};

export const deleteUserProfile = async (

    userId

) => {

    const profile =

        await findAppUserByUserId(

            userId

        );

    if (!profile) {

        throw new NotFoundError(

            "User profile not found."

        );

    }

    await deleteAppUserProfile(

        userId

    );

    await sendNotification({

        receiver: userId,

        title: "Profile Deleted",

        message:
            "Your profile has been deleted successfully.",

        type: "system",

        priority: "medium",

    });

    return;

};