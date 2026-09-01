const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNzE5MTFjOWFhMWNhM2RiNDAzZGViYSIsInJvbGUiOiJ2ZW5kb3IiLCJwZXJtaXNzaW9ucyI6eyJhZG1pbiI6ZmFsc2V9LCJpc1N1cGVyQWRtaW4iOmZhbHNlLCJpYXQiOjE3ODgyODQzMTksImV4cCI6MTc4ODg4OTExOX0.sfW9vg2az-s4P1WfTrhptmp-L9uFVt1QeOSOquJva_8";

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