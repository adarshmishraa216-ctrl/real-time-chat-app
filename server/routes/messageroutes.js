import express from "express";
import { protectedroute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendmessage } from "../controllers/messagecontroller.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectedroute, getUsersForSidebar);
messageRouter.get("/:id", protectedroute, getMessages);
messageRouter.put("/mark/:id", protectedroute, markMessageAsSeen);
messageRouter.post("/send/:id",protectedroute,sendmessage)

export default messageRouter;