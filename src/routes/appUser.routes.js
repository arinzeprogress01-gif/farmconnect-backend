import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import userOnly from "../middleware/userOnly.middleware.js";

import {

    createProfile,

    getProfile,

    updateProfile,

    deleteProfile,

} from "../controllers/appUser.controller.js";

const router = express.Router();

router.post(

    "/profile",

    authenticate,

    userOnly,

    createProfile

);

router.get(

    "/profile",

    authenticate,

    userOnly,

    getProfile

);

router.patch(

    "/profile",

    authenticate,

    userOnly,

    updateProfile

);

router.delete(

    "/profile",

    authenticate,

    userOnly,

    deleteProfile

);

export default router;

