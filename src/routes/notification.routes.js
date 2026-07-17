import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import {

    getNotifications,

    getUnreadNotifications,

    getNotification,

    readNotification,

    readAllNotifications,

} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(authenticate);

router.get(

    "/",

    getNotifications

);

router.get(

    "/unread",

    getUnreadNotifications

);

router.get(

    "/:notificationId",

    getNotification

);

router.patch(

    "/:notificationId/read",

    readNotification

);

router.patch(

    "/read-all",

    readAllNotifications

);

export default router;