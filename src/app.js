import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";

import notFound from "./middleware/not-found.middleware.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "FarmConnect API Running...",
    });
});

app.use("/api/v1/auth", authRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;