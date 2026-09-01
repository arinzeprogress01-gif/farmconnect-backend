import jwt from "jsonwebtoken";

export const authenticateSocket = (socket, next) => {

    try {

        const token =
            socket.handshake.auth?.token;

        if (!token) {

            console.log(
                "❌ Socket connection rejected: No token."
            );

            return next(
                new Error("Authentication required.")
            );

        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log(
            "✅ Socket JWT verified."
        );

        console.log(
            "Socket user:",
            decoded
        );

        socket.user = decoded;

        next();

    } catch (error) {

        console.log(
            "❌ Socket authentication failed:",
            error.message
        );

        next(
            new Error(
                "Invalid authentication token."
            )
        );

    }

};