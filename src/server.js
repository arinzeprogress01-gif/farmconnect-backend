import "./config/env.js";

import http from "http";

import app from "./app.js";

import connectDB from "./config/database.config.js";

import {
    startReservationExpirationJob,
} from "./jobs/reservationExpiration.job.js";

import {
    startListingExpirationJob,
} from "./jobs/listingExpiration.job.js";

import
    {initializeSocket}
    from "./sockets/socket.server.js";

import {
    setSocketIO
} from "./sockets/socket.events.js";

const PORT = process.env.PORT || 5000;


const startServer = async () => {

    await connectDB();

    startListingExpirationJob();
    startReservationExpirationJob();

    const server = http.createServer(app);

    const io = initializeSocket(server);
    setSocketIO(io);

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

};


startServer();