const VendorProfile = require("../models/vendorProfile.model");

const createVendorProfile = async (vendorData) => {
    return await VendorProfile.create(vendorData);
};

const findVendorByUserId = async (userId) => {
    return await VendorProfile.findOne({ userId });
};

export {
    createVendorProfile,
    findVendorByUserId,
};