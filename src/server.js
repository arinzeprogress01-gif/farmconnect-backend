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
import { setTimeout as delay } from "node:timers/promises";

import redisClient from "./config/redis.config.js";
import {
    setRedisValue,
    getRedisValue,
    getRedisTimeToLive,
    deleteRedisValue,
} from "./services/redis.service.js";
const PORT = process.env.PORT || 5000;


const startServer = async () => {

    await connectDB();

    await redisClient.connect();

    await setRedisValue(
        "farmconnect:ttl-test",
        "This will expire",
        3
    );

    console.log(
        "Initial TTL:",
        await getRedisTimeToLive("farmconnect:ttl-test"),
        "seconds"
    );

    await delay(1000);

    console.log(
        "TTL after 3 seconds:",
        await getRedisTimeToLive("farmconnect:ttl-test"),
        "seconds"
    );

    await delay(1000);

    console.log(
        "TTL after another 4 seconds:",
        await getRedisTimeToLive("farmconnect:ttl-test"),
        "seconds"
    );

    console.log(
        "Value:",
        await getRedisValue("farmconnect:ttl-test")
    );
await delay(1000);

console.log(
    "Final value:",
    await getRedisValue("farmconnect:ttl-test")
);
    startListingExpirationJob();
    startReservationExpirationJob();

    const server = http.createServer(app);

    initializeSocket(server);

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

};


startServer();