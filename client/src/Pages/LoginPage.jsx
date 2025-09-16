import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/authcontext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [currentstate, setcurrentstate] = useState("login"); // default to login
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [bio, setbio] = useState("");

  const { login, signup } = useContext(AuthContext); // ✅ use new functions
  const navigate = useNavigate();

  const onSubmithandler = async (event) => {
    event.preventDefault();

    try {
      let res;
      if (currentstate === "sign up") {
        res = await signup({ fullname, email, password, bio });
      } else {
        res = await login({ email, password });
      }

      if (res?.success) {
        navigate("/");
      } else {
        toast.error(res?.message || "Authentication failed");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Left */}
      <img src={assets.logo_big} alt="Logo" className="w-[min(30vw,250px)]" />

      {/* Right */}
      <form
        onSubmit={onSubmithandler}
        className="border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentstate}
        </h2>

        {/* Signup Fullname Field */}
        {currentstate === "sign up" && (
          <input
            onChange={(e) => setfullname(e.target.value)}
            value={fullname}
            type="text"
            placeholder="Full name"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
          />
        )}

        {/* Email and Password Fields */}
        <input
          onChange={(e) => setemail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email address"
          required
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          onChange={(e) => setpassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          required
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Signup Bio Field */}
        {currentstate === "sign up" && (
          <textarea
            onChange={(e) => setbio(e.target.value)}
            value={bio}
            rows={4}
            placeholder="Provide a short bio"
            required
            className="p-2 border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:ring-2"
          ></textarea>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-md cursor-pointer"
        >
          {currentstate === "sign up" ? "Create account" : "Login now"}
        </button>

        {/* Switch Between Login and Signup */}
        <div className="flex flex-col gap-2">
          {currentstate === "sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => setcurrentstate("login")}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account{" "}
              <span
                onClick={() => setcurrentstate("sign up")}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
