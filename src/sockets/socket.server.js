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

        console.log("=================================");
        console.log("🔌 SOCKET CONNECTED");
        console.log("Socket ID:", socket.id);
        console.log("Socket User:", socket.user);
        console.log("User ID:", socket.user.id);
        console.log("User Role:", socket.user.role);
        console.log("=================================");


        const userRoom = `user:${socket.user.id}`;

        socket.join(userRoom);

        console.log("🏠 Joined User Room:", userRoom);


        if (socket.user.role) {

            const roleRoom = `role:${socket.user.role}`;

            socket.join(roleRoom);

            console.log("🏠 Joined Role Room:", roleRoom);

            console.log(
                "📡 Role Room Members:",
                io.sockets.adapter.rooms.get(roleRoom)?.size || 0
            );
        }


        console.log(
            "📡 User Room Members:",
            io.sockets.adapter.rooms.get(userRoom)?.size || 0
        );


        socket.on("disconnect", (reason) => {

            console.log("=================================");
            console.log("🔌 SOCKET DISCONNECTED");
            console.log("Socket ID:", socket.id);
            console.log("Reason:", reason);
            console.log("=================================");

        });

    });

    return io;
};