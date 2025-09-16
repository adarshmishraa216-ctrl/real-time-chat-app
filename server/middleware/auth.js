import jwt from "jsonwebtoken";   // ✅ this was missing
import User from "../models/user.js";   // Use capital U

export const protectedroute = async (req, res, next) => {
  try {
    const token = req.headers.token;  // ✅ take token from headers

    if (!token) {
      return res.json({
        success: false,
        message: "No token, authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.json({ success: false, message: "Token is not valid" });
  }
};
