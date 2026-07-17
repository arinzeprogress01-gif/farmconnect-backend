import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import userRoutes from "./routes/user.routes.js";
import listingRoutes from "./routes/listing.routes.js";

import reservationRoutes from "./routes/reservation.routes.js";

import notificationRoutes from "./routes/notification.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

import notFound from "./middleware/not-found.middleware.js";
import errorHandler from "./middleware/error.middleware.js";

import {
    startListingExpirationJob,
} from "./jobs/listingExpiration.job.js";


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const app = express();

app.use(helmet());

app.use(cors());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "FarmConnect API Running...",
    });
});

app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);
app.use("/api/v1/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/listings",listingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations",
reservationRoutes);
app.use(

    "/api/notifications",

    notificationRoutes

);
app.use(
    "/api/analytics",
    analyticsRoutes
);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.get("/openapi.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

app.use(notFound);

app.use(errorHandler);

startListingExpirationJob();

export default app;