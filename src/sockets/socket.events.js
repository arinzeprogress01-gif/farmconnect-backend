let io;

export const setSocketIO = (socketIO) => {
    io = socketIO;
};

export const emitToUser = (
    userId,
    event,
    data
) => {

    if (!io) {
        console.warn(
            "Socket.IO is not initialized."
        );

        return;
    }

    if (!userId) {
        console.warn(
            `Cannot emit ${event}: userId is missing.`
        );

        return;
    }

    console.log("=================================");
    console.log("📡 SOCKET EMIT TO USER");
    console.log("Event:", event);
    console.log("User ID:", userId);
    console.log("Room:", `user:${userId}`);
    console.log("Data:", data);
    console.log("=================================");

    io
        .to(`user:${userId}`)
        .emit(event, data);
};


export const emitToRole = (role, event, data) => {
    if (!io) {
        console.warn("⚠️ Socket.IO is not initialized.");
        return;
    }

    if (!role) {
        console.warn(`⚠️ Cannot emit ${event}: role is missing.`);
        return;
    }

    const roleRoom = `role:${role}`;

    console.log("=================================");
    console.log("📡 SOCKET EMIT TO ROLE");
    console.log("Event:", event);
    console.log("Role:", role);
    console.log("Room:", roleRoom);

    console.log(
        "Connected Members:",
        io.sockets.adapter.rooms.get(roleRoom)?.size || 0
    );

    console.log("Data:", data);
    console.log("=================================");

    io.to(roleRoom).emit(event, data);
};