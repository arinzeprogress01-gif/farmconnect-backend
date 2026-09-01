import { Server } from "socket.io";
import { authenticateSocket } from "./socket.auth.js";

export const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.use(authenticateSocket);

    io.on("connection", (socket) => {

        console.log(
            `🔌 Authenticated client connected: ${socket.id}`
        );

        console.log(
            `👤 User: ${socket.user.id}`
        );

        const userRoom =
            `user:${socket.user.id}`;

        socket.join(userRoom);

        console.log(
            `🏠 Joined room: ${userRoom}`
        );

        socket.on("disconnect", () => {

            console.log(
                `🔌 Client disconnected: ${socket.id}`
            );

        });

    });

    return io;
};