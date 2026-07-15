// ===========================================
// FarmConnect Notification Registration Page
// ===========================================

// -----------------------------
// DOM Elements
// -----------------------------

const statusText = document.getElementById("status");

const tokenDisplay = document.getElementById("deviceToken");

const jwtInput = document.getElementById("jwt");

const registerBtn = document.getElementById("registerBtn");

const testBtn = document.getElementById("testBtn");

// --------------------------------------
// Backend URL
// --------------------------------------

const API_URL = "https://YOUR-RENDER-URL.onrender.com";

// --------------------------------------
// Firebase Initialization
// --------------------------------------

/*

UNCOMMENT AFTER

npm install firebase

import { initializeApp } from

"https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {

getMessaging,

getToken

}

from

"https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging.js";


const firebaseConfig = {

apiKey: "...",

authDomain: "...",

projectId: "...",

storageBucket: "...",

messagingSenderId: "...",

appId: "..."

};


const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

*/

// --------------------------------------
// Request Permission
// --------------------------------------

async function requestPermission() {

    try {

        statusText.innerText =
            "Requesting notification permission...";

        const permission =
            await Notification.requestPermission();

        if (permission !== "granted") {

            statusText.innerText =
                "Notification permission denied.";

            return;

        }

        statusText.innerText =
            "Permission granted.";

        await registerDevice();

    }

    catch (err) {

        console.error(err);

    }

}

async function registerDevice() {

    try {

        statusText.innerText =
            "Generating device token...";

        /*

        const token = await getToken(

            messaging,

            {

                vapidKey:

                "YOUR_PUBLIC_VAPID_KEY"

            }

        );

        */

        // Temporary placeholder

        const token =
            "TEMP_FIREBASE_TOKEN";

        tokenDisplay.value = token;

        const jwt = jwtInput.value.trim();

        if (!jwt) {

            alert("Enter your JWT.");

            return;

        }

        const response = await fetch(

            `${API_URL}/api/users/device`,

            {

                method: "POST",

                headers: {

                    Authorization:

                        `Bearer ${jwt}`,

                    "Content-Type":

                        "application/json"

                },

                body: JSON.stringify({

                    token,

                    platform: "web",

                    browser:

                        navigator.userAgent

                })

            }

        );

        const data =
            await response.json();

        console.log(data);

        statusText.innerText =
            "Device registered successfully.";

    }

    catch (err) {

        console.error(err);

        statusText.innerText =
            "Registration failed.";

    }

}

registerBtn.addEventListener(

    "click",

    requestPermission

);

testBtn.addEventListener(

    "click",

    () => {

        alert(

            "Backend ready.\n\nAfter Firebase installs,\nthis button will call\nour test notification endpoint."

        );

    }

);
