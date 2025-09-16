import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userroutes from "./routes/userroutes.js";
import messageRouter from "./routes/messageroutes.js";
import { Server } from "socket.io";

const app = express();
const web_server = http.createServer(app);

// initialise socket.io
export const io = new Server(web_server, {
  cors: { origin: "*" },
});

// store online users { userid: socketid }
export const usersocketmap = {};

// socket.io connection handlers
io.on("connection", (socket) => {
  const userid = socket.handshake.query.userid;
  console.log("user connected", userid);

  if (userid) usersocketmap[userid] = socket.id;

  // emit online users to all connected clients
  io.emit("getonlineuser", Object.keys(usersocketmap));

  socket.on("disconnect", () => {
    console.log("user disconnected", userid);
    delete usersocketmap[userid];
    io.emit("getonlineuser", Object.keys(usersocketmap));
  });
});

// setup for middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// routes
app.use("/api/status", (req, res) => res.send("server is live"));
app.use("/api/auth", userroutes);
app.use("/api/message", messageRouter);

// connect DB
await connectDB();

const port = process.env.PORT || 5001;
web_server.listen(port, () =>
  console.log("server is running on port: " + port)
);
