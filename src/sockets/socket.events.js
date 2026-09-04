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

    io
        .to(`user:${userId}`)
        .emit(event, data);
};


export const emitToRole = (
    role,
    event,
    data
) => {

    if (!io) {
        console.warn(
            "Socket.IO is not initialized."
        );

        return;
    }

    if (!role) {
        console.warn(
            `Cannot emit ${event}: role is missing.`
        );

        return;
    }

    io
        .to(`role:${role}`)
        .emit(event, data);
};