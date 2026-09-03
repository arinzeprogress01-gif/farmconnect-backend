import getToken from "../../utils/jwt.utils.js"
const token = getToken();

const socket = io("https://farmconnect-backend-docker.onrender.com", {
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