import jwt from "jsonwebtoken";

import User from "../models/user.models.js";

import { UnauthorizedError } from "../errors/unauthorized-error.js";

const authenticate = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return next(
                new UnauthorizedError(
                    "Authentication required."
                )
            );

        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {

            return next(
                new UnauthorizedError(
                    "User not found."
                )
            );

        }

        req.user = user;

        next();

    } catch (error) {

        next(
            new UnauthorizedError(
                "Invalid or expired token."
            )
        );

    }

};

export default authenticate;