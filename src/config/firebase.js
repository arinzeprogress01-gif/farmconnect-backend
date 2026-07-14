import "./env.js";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

console.log("PROJECT:", process.env.FIREBASE_PROJECT_ID);

console.log("EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);

console.log(

    "PRIVATE:",

    process.env.FIREBASE_PRIVATE_KEY
        ? "Loaded"
        : "Missing"

);

if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PRIVATE_KEY
) {
    throw new Error("Firebase environment variables are missing.");
}

const app =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(
                    /\\n/g,
                    "\n"
                ),
            }),
        });

export const messaging = getMessaging(app);

export default app;