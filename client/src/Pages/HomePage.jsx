import React, { useContext } from "react";
import SideBar from "../Component/SideBar";
import ChatContainer from "../Component/ChatContainer";
import RightSidebar from "../Component/RightSidebar";
import { ChatContext } from "../../context/chatcontext";
import { AuthContext } from "../../context/authcontext"; // ✅ get authUser

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext); // ✅ get logged-in user

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-200 text-white rounded-2xl overflow-hidden h-full grid relative ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr]"
            : "xl:grid-cols-[1fr_2fr_1fr] md:grid-cols-2"
        }`}
      >
        {/* Pass authUser as prop */}
        <SideBar authUser={authUser} />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;
