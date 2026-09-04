import { Server } from "socket.io";
import { authenticateSocket } from "./socket.auth.js";
import { setSocketIO } from "./socket.events.js";

export const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    setSocketIO(io);

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


        // Join role-specific room
        if (socket.user.role) {

            const roleRoom =
                `role:${socket.user.role}`;

            socket.join(roleRoom);

            console.log(
                `🏠 Joined role room: ${roleRoom}`
            );
        }


        socket.on("disconnect", () => {

            console.log(
                `🔌 Client disconnected: ${socket.id}`
            );

        });

    });

    return io;
};