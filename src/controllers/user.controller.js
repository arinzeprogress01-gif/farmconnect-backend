import {

    registerDevice as registerDeviceService,

} from "../services/user.service.js";

export const registerDevice = async (

    req,

    res,

    next

) => {

    try {

        const result =

            await registerDeviceService(

                req.user.id,

                req.body

            );

        res.status(200).json(result);

    }

    catch (error) {

        next(error);

    }

};