// client/context/authcontext.jsx

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// ✅ Correct path because this file is outside "src"
import assets from "../src/assets/assets";

const backendurl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendurl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ signup
  const signup = async (credentials) => {
    try {
      const { data } = await axios.post("/api/auth/signup", credentials);

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);

        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);

        toast.success(data.message || "Signup successful");
        return { success: true };
      } else {
        toast.error(data.message || "Signup failed");
        return { success: false };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return { success: false };
    }
  };

  // ✅ login
  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/api/auth/login", credentials);

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);

        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);

        toast.success(data.message || "Login successful");
        return { success: true };
      } else {
        toast.error(data.message || "Login failed");
        return { success: false };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return { success: false };
    }
  };

  // ✅ logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    axios.defaults.headers.common["token"] = null;
    socket?.disconnect();
    toast.success("Logged out successfully");
  };

  // ✅ update profile
  const updateProfile = async (body) => {
    try {
      const savedToken = localStorage.getItem("token");

      const { data } = await axios.put("/api/auth/update-profile", body, {
        headers: {
          token: savedToken,
        },
      });

      if (data.success) {
        setAuthUser(data.user);
        localStorage.setItem("authUser", JSON.stringify(data.user));
        toast.success("Profile updated successfully");
        return { success: true };
      } else {
        toast.error(data.message || "Update failed");
        return { success: false }; 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return { success: false };
    }
  };

  // ✅ check authentication on refresh
  useEffect(() => {
    const verifyUserOnLoad = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("/api/auth/check-auth", {
          headers: { token: savedToken },
        });

        if (data.success) {
          setAuthUser(data.user);
          connectSocket(data.user);
          setToken(savedToken);
          axios.defaults.headers.common["token"] = savedToken;
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyUserOnLoad();
  }, []);

  // ✅ connect socket
  const connectSocket = (user) => {
    if (!user || socket?.connected) return;

    const newSocket = io(backendurl, {
      query: { userId: user.id },
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUser(userIds);
    });
  };

  // ✅ keep axios header in sync with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    } else {
      delete axios.defaults.headers.common["token"];
    }
  }, [token]);

  const value = {
    axios,
    token,
    authUser,
    onlineUser,
    socket,
    signup,
    login,
    logout,
    updateProfile,
    loading,
    assets, // ✅ now assets available globally if needed
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
