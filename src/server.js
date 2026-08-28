import "./config/env.js";

import app from "./app.js";

import connectDB from "./config/database.config.js";

import {
    startReservationExpirationJob,
} from "./jobs/reservationExpiration.job.js";

import {
    startListingExpirationJob,
} from "./jobs/listingExpiration.job.js";


const PORT = process.env.PORT || 5000;


const startServer = async () => {

    await connectDB();

    startListingExpirationJob();

    startReservationExpirationJob();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

};


startServer();