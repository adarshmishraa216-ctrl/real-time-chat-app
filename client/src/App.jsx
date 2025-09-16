import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import UserPage from "./Pages/UserPage";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/authcontext";

const App = () => {
  const { authUser, loading } = useContext(AuthContext);

  // Wait until auth check is finished
  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/user"
            element={
              authUser ? (
                <UserPage fullName={authUser.fullName} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
