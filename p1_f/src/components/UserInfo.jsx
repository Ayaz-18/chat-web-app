import React from "react";

export default function UserInfo({ selectedUser, showInfo, setShowInfo }) {
  if (!showInfo || !selectedUser) return null;

  return (
    <div className="w-[25%] bg-gray-900/90 border-l border-gray-700 flex flex-col">

      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className="font-semibold">User Details</span>
        <button
          onClick={() => setShowInfo(false)}
          className="text-red-400 text-xl"
        >
          ✖
        </button>
      </div>

      <div className="flex flex-col items-center p-6 gap-3">
        <img
          src={selectedUser.profilepic}
          className="h-24 w-24 rounded-full"
          alt=""
        />
        <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
        <p className="text-sm text-gray-300">{selectedUser.email}</p>
        <p className="text-sm text-gray-400">{selectedUser.bio}</p>
      </div>
    </div>
  );
}
