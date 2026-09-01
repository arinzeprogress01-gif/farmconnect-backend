const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNzI2OTBhOTQ3ZDE0OTdjYjZhNGQ1MSIsInJvbGUiOiJ1c2VyIiwicGVybWlzc2lvbnMiOnsiYWRtaW4iOmZhbHNlfSwiaXNTdXBlckFkbWluIjpmYWxzZSwiaWF0IjoxNzg4MTg2MTMxLCJleHAiOjE3ODg3OTA5MzF9.Txkynf27yhMrgzJ5eqWJDpnmZXzLJajwf1XHfAm1LLA";

const socket = io({
    auth: {
        token
    }
});

const status = document.getElementById("status");
const messages = document.getElementById("messages");
const sendButton = document.getElementById("sendButton");

socket.on("connect", () => {

    status.textContent = "🟢 Connected";

    addMessage(
        `Connected with socket ID: ${socket.id}`
    );

});

socket.on("disconnect", () => {

    status.textContent = "🔴 Disconnected";

    addMessage(
        "Socket disconnected."
    );

});

socket.on(
    "notification:new",
    (notification) => {

        addMessage(
            `🔔 Notification: ${
                JSON.stringify(notification)
            }`
        );

    }
);


socket.on(
    "activity:new",
    (activity) => {

        addMessage(
            `📢 Activity: ${
                JSON.stringify(activity)
            }`
        );

    }
);

socket.on("test:event", (data) => {

    addMessage(
        `Server event: ${JSON.stringify(data)}`
    );

});

sendButton.addEventListener("click", () => {

    socket.emit("test:event", {

        message: "Hello from FarmConnect!",

        time: new Date().toISOString()

    });

});

function addMessage(message) {

    const div = document.createElement("div");

    div.ClassName = "message";

    div.textContent = message;

    messages.appendChild(div);

}