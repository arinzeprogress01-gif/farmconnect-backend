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