import React, { useState } from "react";
import axios from "axios";

export default function LeftSidebar({
  currentUser,
  search,
  setSearch,
  filteredUsers,
  setSelectedUser,
  setShowInfo,
  setCurrentUser,
  onlineUsers = [],
  unread = {},
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [selectedFile, setSelectedFile] = useState(null);

  if (!currentUser) return null;

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);

      if (selectedFile) {
        formData.append("profilepic", selectedFile);
      }

      const res = await axios.put(
        "/user/update-profile",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCurrentUser(res.data.user);
      setShowEdit(false);
      alert("Profile Updated ✅");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="w-[25%] bg-gray-900/80 flex flex-col border-r border-gray-700 relative">
      
      {/* ---------------- Profile Header ---------------- */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3 relative">
          <img
            src={currentUser.profilepic}
            className="h-10 w-10 rounded-full"
            alt=""
          />

          <span className="absolute bottom-0 left-7 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>

          <div>
            <p className="font-semibold">{currentUser.name}</p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>

        <button
          onClick={() => setShowEdit(true)}
          className="text-sm bg-blue-600 px-3 py-1 rounded"
        >
          Edit
        </button>
      </div>

      {/* ---------------- Search ---------------- */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 outline-none"
        />
      </div>

      {/* ---------------- User List ---------------- */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const unreadCount = unread[user._id];

          return (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setShowInfo(true);
              }}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800 relative"
            >
              <div className="relative">
                <img
                  src={user.profilepic}
                  className="h-10 w-10 rounded-full"
                  alt=""
                />

                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
                )}
              </div>

              <div className="flex-1">
                <p>{user.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {user.bio}
                </p>
              </div>

              {unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ---------------- Edit Profile Modal ---------------- */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-[320px]">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full mb-3 p-2 rounded bg-gray-700 outline-none"
            />

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              className="w-full mb-3 p-2 rounded bg-gray-700 outline-none"
            />

            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full mb-4 text-sm"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEdit(false)}
                className="px-3 py-1 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-blue-600 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}