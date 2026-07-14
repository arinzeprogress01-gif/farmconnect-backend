import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const serviceAccount = require("./firebase/serviceAccount.json");

const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
    });

export const messaging = getMessaging(app);

export default app;