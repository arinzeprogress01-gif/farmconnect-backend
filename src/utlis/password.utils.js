import bcrypt from "bcrypt";

import {SALT_ROUNDS} from "../constsnts/securoty.constant.js"

const hashPassword = async (password) => {
    const salt = await bcrypt.gensalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
};

const comparePassword = async (
    password,
    hashedPassword
) => {
    return bcrypt.compare(password, hashedPassword);
};

export {
    hashPassword,
    comparePassword
};