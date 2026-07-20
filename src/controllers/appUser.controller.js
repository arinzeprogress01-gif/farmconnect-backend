import {

    createUserProfile,

    getUserProfile,

    updateUserProfile,

    deleteUserProfile,

} from "../services/appUser.service.js";

export const createProfile = async (

    req,

    res,

    next

) => {

    try {

        const profile =

            await createUserProfile(

                req.user._id,

                req.body

            );

        res.status(201).json({

            success: true,

            message:

                "User profile created successfully.",

            data: profile,

        });

    } catch (error) {

        next(error);

    }

};

export const getProfile = async (

    req,

    res,

    next

) => {

    try {

        const profile =

            await getUserProfile(

                req.user._id

            );

        res.status(200).json({

            success: true,

            message:

                "User profile retrieved successfully.",

            data: profile,

        });

    } catch (error) {

        next(error);

    }

};

export const updateProfile = async (

    req,

    res,

    next

) => {

    try {

        const profile =

            await updateUserProfile(

                req.user._id,

                req.body

            );

        res.status(200).json({

            success: true,

            message:

                "User profile updated successfully.",

            data: profile,

        });

    } catch (error) {

        next(error);

    }

};

export const deleteProfile = async (

    req,

    res,

    next

) => {

    try {

        await deleteUserProfile(

            req.user._id

        );

        res.status(200).json({

            success: true,

            message:

                "User profile deleted successfully.",

        });

    } catch (error) {

        next(error);

    }

};