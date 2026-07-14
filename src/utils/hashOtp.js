import bcrypt from "bcryptjs";

export const hashOtp = async (

    otp

) => {

    return await bcrypt.hash(

        otp,

        10

    );

};

export const compareOtp = async (

    otp,

    hash

) => {

    return await bcrypt.compare(

        otp,

        hash

    );

};