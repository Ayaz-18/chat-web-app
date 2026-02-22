import express from "express";
import { connect } from "./Utils/ConnectDb.js";
import cors from "cors";
import userrouter from "./Routes/User.route.js";
import messagerouter from "./Routes/Message.Routes.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import events from "events";

events.defaultMaxListeners = 20; // Fix warning

const app = express();
const server = http.createServer(app);
const __dirname1 = path.resolve();

// ---------------- MIDDLEWARES ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// ---------------- API ROUTES ----------------
app.use("/user", userrouter);
app.use("/message", messagerouter);

// ---------------- DATABASE ----------------
connect()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("Database connection failed:", err));

// ---------------- SOCKET.IO ----------------
export const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

export const onlineUsers = {};
io.on("connection", (socket) => {
    const userid = socket.handshake.query.userid;
    console.log("User connected:", userid);
    if (userid) onlineUsers[userid] = socket.id;

    io.emit("online-users", Object.keys(onlineUsers));

    socket.on("disconnect", () => {
        console.log("User disconnected:", userid);
        delete onlineUsers[userid];
        io.emit("online-users", Object.keys(onlineUsers));
    });
});

// ---------------- PRODUCTION FRONTEND ----------------
// 
// Get the root directory
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    // Serve static files from dist
    app.use(express.static(path.join(__dirname, "../p1_f/dist")));

    // Catch-all route for React Router
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "p1_f/dist", "index.html"));
    });
}

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;