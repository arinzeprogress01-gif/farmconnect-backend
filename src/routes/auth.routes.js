import express from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", validate, registerUser);

export default router;