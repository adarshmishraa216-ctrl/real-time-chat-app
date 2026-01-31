import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/userroutes.js";
import messageRoutes from "./routes/messageroutes.js";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

/* ------------------ MIDDLEWARE ------------------ */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "50mb" })); // ✅ Increased limit for image uploads
app.use(express.urlencoded({ limit: "50mb", extended: true })); // ✅ Also increase for urlencoded

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("(.*)", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    console.log("-> Body limit set to 50mb");
  });
});
