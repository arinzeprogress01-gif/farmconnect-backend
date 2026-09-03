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

import redisClient from "./config/redis.config.js";

const PORT = process.env.PORT || 5000;


const startServer = async () => {

    await connectDB();

    await redisClient.connect();

    await redisClient.set("farmconnect:test", "Redis is working!");

    const testValue = await redisClient.get("farmconnect:test");

    console.log("Redis test value:", testValue);

    await redisClient.del("farmconnect:test");

    startListingExpirationJob();
    startReservationExpirationJob();

    const server = http.createServer(app);

    initializeSocket(server);

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

};


startServer();