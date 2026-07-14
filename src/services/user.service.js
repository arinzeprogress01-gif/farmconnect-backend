import deviceSchema from "../validators/device.validator.js";

import BadRequestError from "../errors/BadRequestError.js";

import NotFoundError from "../errors/NotFoundError.js";

import {

    findUserById,

    registerUserDevice,

} from "../repositories/user.repository.js";

export const registerDevice = async (

    userId,

    deviceData

) => {

    const { error, value } =

        deviceSchema.validate(

            deviceData

        );

    if (error) {

        throw new BadRequestError(

            error.details[0].message

        );

    }

    const user =

        await findUserById(userId);

    if (!user) {

        throw new NotFoundError(

            "User not found."

        );

    }

    await registerUserDevice(

        user,

        value

    );

    return {

        message:

            "Device registered successfully.",

    };

};