import React from "react";

const UserPage = ({ fullName }) => {
  return (
    <div className="flex items-center justify-center h-screen text-white">
      <h1 className="text-2xl font-bold">Welcome, {fullName} 🎉</h1>
    </div>
  );
};

export default UserPage;
