import vendorProfileSchema from "../validators/vendor.validator.js";

import User from "../models/user.models.js";

import sendNotification  from "../utils/sendNotification.js";

import {
    createVendor,
    findVendorByUserId,
    findVendorById,
    updateVendors,
    getVendorByUserId,
    updateVendorProfile,
    deleteVendorProfile

} from "../repositories/vendor.repository.js";

import BadRequestError from "../errors/BadRequestError.js";
import { ConflictError} from "../errors/conflict-error.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import NotFoundError from "../errors/NotFoundError.js";
import { ROLES } from "../constants/roles.js";

export const createVendorProfile = async (
    userId,
    vendorData
) => {

    // 1. Validate request body
    const { error, value } =
        vendorProfileSchema.validate(vendorData);

    if (error) {
        throw new BadRequestError(
            error.details[0].message
        );
    }

    // 2. Get authenticated user
    const user = await User.findById(userId);

    if (!user) {
        throw new BadRequestError("User not found.");
    }

    if (user.role !== ROLES.VENDOR) {

        throw new ForbiddenError(
            "Only vendors can create a vendor profile."
        );

    }

    // 4. Prevent duplicate profiles
    const existingVendor =
        await findVendorByUserId(userId); 

    if (existingVendor) {
        throw new ConflictError(
            "Vendor profile already exists."
        );
    }

    // 5. Create vendor profile
    const vendor = await createVendor({

        userId,

        ...value,

    });

    // 6. Mark profile completed
    user.profileCompleted = true;

    await user.save();

    await sendNotification({

        receiver: user._id,

        title: "Vendor Profile Created",

        message:
            "Congratulations! Your vendor profile has been created successfully. You can now start publishing food listings.",

        type: "vendor",

        priority: "medium",

        data: {

            vendorId: vendor._id,

            action: "OPEN_VENDOR_PROFILE",

        },

    });

    return vendor;
};

export const getVendorProfile = async (
    userId
) => {

    const vendor =
        await getVendorByUserId(userId);

    if (!vendor) {

        throw new NotFoundError(
            "Vendor profile not found."
        );

    }

    return vendor;

};

export const updateVendor = async (

    userId,

    vendorData

) => {

    const vendor =
        await getVendorByUserId(userId);

    if (!vendor) {

        throw new NotFoundError(
            "Vendor profile not found."
        );

    }

    const updatedVendor =
        await updateVendorProfile(

            userId,

            vendorData

        );

    await sendNotification({

        receiver: userId,

        title: "Vendor Profile Updated",

        message:
            "Your vendor profile has been updated successfully.",

        type: "vendor",

        priority: "low",

        data: {

            vendorId: updatedVendor._id,

            action: "OPEN_VENDOR_PROFILE",

        },

    });

    return updatedVendor;

};

export const deleteVendor = async (
    userId
) => {

    const vendor =
        await getVendorByUserId(userId);

    if (!vendor) {

        throw new NotFoundError(
            "Vendor profile not found."
        );

    }

    await deleteVendorProfile(userId);

    await sendNotification({

        receiver: userId,

        title: "Vendor Profile Deleted",

        message:
            "Your vendor profile has been removed successfully.",

        type: "vendor",

        priority: "high",

        data: {

            action: "OPEN_HOME",

        },

    });

    return;

};