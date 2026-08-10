import * as vendorService from "../services/vendor.service.js";

export const createVendorProfile = async (
    req,
    res,
    next
) => {

    try {

        const vendor =
            await vendorService.createVendorProfile(

                req.user._id,

                req.body

            );

        return res.status(201).json({

            success: true,

            message:
                "Vendor profile created successfully.",

            data: vendor,

        });

    } catch (error) {

        next(error);

    }

};

export const getVendorProfile = async (

    req,

    res,

    next

) => {

    try {

        const vendor =
            await vendorService.getVendorProfile(

                req.user._id

            );

        res.status(200).json({

            success: true,

            data: vendor,

        });

    } catch (error) {

        next(error);

    }

};

export const updateVendorProfile =
    async (

        req,

        res,

        next

    ) => {

        try {

            const vendor =
                await vendorService.updateVendor(

                    req.user._id,

                    req.body

                );

            res.status(200).json({

                success: true,

                message:
                    "Vendor profile updated successfully.",

                data: vendor,

            });

        } catch (error) {

            next(error);

        }

    };

export const updateVendorCurrentLocation = async (
    req,
    res,
    next
) => {

    try {

        const {
            longitude,
            latitude,
        } = req.body;

        const vendor =
            await vendorService.updateVendorCurrentLocation(
                req.user._id,
                longitude,
                latitude
            );

        return res.status(200).json({

            success: true,

            message:
                "Vendor location updated successfully.",

            data: {
                location: vendor.location,
            },

        });

    } catch (error) {

        next(error);

    }

};

export const deleteVendorProfile =
    async (

        req,

        res,

        next

    ) => {

        try {

            await vendorService.deleteVendor(

                req.user._id

            );

            res.status(200).json({

                success: true,

                message:
                    "Vendor profile deleted successfully.",

            });

        } catch (error) {

            next(error);

        }

    };