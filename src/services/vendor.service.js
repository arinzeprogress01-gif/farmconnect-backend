import vendorProfileSchema from "../validators/vendor.validator.js";

import User from "../models/user.models.js";

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

    return;

};