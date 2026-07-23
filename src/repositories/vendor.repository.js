import VendorProfile from "../models/vendor.model.js";

export const createVendor = async (data) => {

    return await VendorProfile.create(data);

};

export const findVendorByUserId = async (userId) => {

    return await VendorProfile.findOne({ userId });

};

export const findVendorById = async (id) => {

    return await VendorProfile.findById(id);

};

export const updateVendors = async (id, data) => {

    return await VendorProfile.findByIdAndUpdate(

        id,

        data,

        {
            returnDocument: "after",
            runValidators: true,
        }

    );

};

export const getVendorByUserId = async (userId) => {

    return await VendorProfile.findOne({ userId });

};

export const updateVendorProfile = async (
    userId,
    data
) => {

    return await VendorProfile.findOneAndUpdate(

        { userId },

        data,

        {
            returnDocument: "after",
            runValidators: true,
        }

    );

};

export const deleteVendorProfile = async (
    userId
) => {

    return await VendorProfile.findOneAndDelete({

        userId,

    });

};