import express from "express";
import { signup, login, updateProfile, checkauth } from "../controllers/user_controller.js";
import { protectedroute } from "../middleware/auth.js";

const userroutes = express.Router();

userroutes.post("/signup", signup);
userroutes.post("/login", login);
userroutes.put("/update-profile", protectedroute, updateProfile);

userroutes.get("/check-auth", protectedroute, checkauth);

export default userroutes;