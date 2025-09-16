import React, { useEffect, useState, useContext } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authcontext";
import { ChatContext } from "../../context/chatcontext";   // ✅ Fixed import

const SideBar = () => {
  const {
    getUsers,              // ✅ Fixed naming
    users,                 // ✅ Fixed naming
    selectedUser,          // ✅ Fixed naming
    setSelectedUser,       // ✅ Fixed naming
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineuser } = useContext(AuthContext);
  const [input, setinput] = useState("");
  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((u) =>
        u.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineuser]);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 border-r rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Header */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />

            {/* Dropdown */}
            <div className="absolute top-full right-0 z-20 bg-[#282142] text-white border border-gray-600 p-5 rounded-md hidden group-hover:block w-32">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={logout} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            onChange={(e) => setinput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="search user..."
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex flex-col">
        {filteredUsers.map((u, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(u);   // ✅ Fixed naming
              setUnseenMessages((prev) => ({ ...prev, [u._id]: 0 }));
            }}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id === u._id ? "bg-[#282142]/50" : ""
            }`}
          >
            <img
              src={u?.profilePic || assets.avatar}
              alt="user"
              className="w-[35px] aspect-[1/1] rounded-full"
            />

            <div className="flex flex-col leading-5">
              <p>{u.fullName}</p>
              {onlineuser.includes(u._id) ? (
                <span className="text-green-400 text-xs">online</span>
              ) : (
                <span className="text-neutral-400 text-xs">offline</span>
              )}
            </div>

            {unseenMessages[u._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {unseenMessages[u._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
