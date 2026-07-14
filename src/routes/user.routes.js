import express from "express";

import  authenticate  from "../middleware/auth.middleware.js";

import {

    registerDevice,

} from "../controllers/user.controller.js";

const router = express.Router();

router.post(

    "/device",

    authenticate,

    registerDevice

);

export default router;