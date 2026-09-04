
const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: false
        }
    });

    io.on("connection", (socket) => {

        console.log(
            `Dashboard connected: ${socket.id}`
        );

        socket.on("disconnect", () => {

            console.log(
                `Dashboard disconnected: ${socket.id}`
            );

        });

    });

    return io;
};

const emitSecurityEvent = (event) => {

    if (!io) {
        return;
    }

    io.emit("security_event", event);
};

module.exports = {
    initializeSocket,
    emitSecurityEvent
};
