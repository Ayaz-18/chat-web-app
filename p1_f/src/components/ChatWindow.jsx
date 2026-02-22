import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import formatTime from "../utils/Format_Time";
import { getSocket } from "../socket";

export default function ChatWindow({
  selectedUser,
  messages,
  currentUser,
  setMessages,
}) {
  const [text, setText] = useState("");
  const API = import.meta.env.VITE_BACKEND_URL;
  const messagesEndRef = useRef(null);

  // 🔥 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 Listen for realtime messages
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("new-message", (newMessage) => {
      if (
        newMessage.senderid === selectedUser?._id ||
        newMessage.recevierid === selectedUser?._id
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("new-message");
    };
  }, [selectedUser]);

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `${API}/message/send/${selectedUser._id}`,
        { text },
        { withCredentials: true }
      );

      setMessages((prev) => [...prev, res.data]); // ✅ correct now
      setText("");
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900/40">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-900/70">
        {selectedUser ? selectedUser.name : "Select a user to chat"}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {selectedUser ? (
          messages.map((msg) => {
            const isMe = msg.senderid === currentUser._id;

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                } gap-2`}
              >
                {!isMe && (
                  <img
                    src={selectedUser.profilepic}
                    className="h-8 w-8 rounded-full"
                    alt=""
                  />
                )}

                <div className="max-w-[60%] flex flex-col">
                  <div
                    className={`p-2 rounded-lg ${
                      isMe ? "bg-blue-600 ml-auto" : "bg-gray-700"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <span
                    className={`text-[10px] text-gray-300 mt-1 ${
                      isMe ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400 text-center mt-10">
            No chat selected
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {selectedUser && (
        <div className="p-4 border-t border-gray-700 flex gap-2 bg-gray-900/70">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded bg-gray-800 outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}