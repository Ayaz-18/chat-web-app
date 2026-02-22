import { useEffect, useState, useRef } from "react";
import LeftSidebar from "../components/LeftSidebar";
import ChatWindow from "../components/ChatWindow";
import UserInfo from "../components/UserInfo";
import axios from "axios";
import { io } from "socket.io-client";

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unread, setUnread] = useState({});

  const socketRef = useRef(null);

  // --------------------------------
  // 1️⃣ Set Logged In User
  // --------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // --------------------------------
  // 2️⃣ Fetch All Users
  // --------------------------------
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/message/all-user", {
        withCredentials: true,
      });

      setUsers(res.data.user || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  // --------------------------------
  // 3️⃣ Fetch Messages
  // --------------------------------
  const fetchMessages = async (id) => {
    try {
      const res = await axios.get(`/message/message/${id}`, {
        withCredentials: true,
      });

      setMessages(res.data.messages);

      await axios.put(
        `/message/mark-as-seen/${id}`,
        {},
        { withCredentials: true }
      );

      // Remove unread count
      setUnread((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (err) {
      console.log(err);
    }
  };

  // --------------------------------
  // 4️⃣ SOCKET SETUP
  // --------------------------------
  useEffect(() => {
    if (!currentUser) return;

    socketRef.current = io("/", {
      withCredentials: true,
      query: { userid: currentUser._id },
    });

    // Online users
    socketRef.current.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    // New message
    socketRef.current.on("new-message", (message) => {
      if (
        selectedUser &&
        (message.senderid === selectedUser._id ||
          message.recevierid === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, message]);

        // Mark as seen instantly
        axios.put(
          `/message/mark-as-seen/${selectedUser._id}`,
          {},
          { withCredentials: true }
        );
      } else {
        // Increase unread count
        setUnread((prev) => ({
          ...prev,
          [message.senderid]:
            prev[message.senderid] ? prev[message.senderid] + 1 : 1,
        }));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentUser, selectedUser]);

  // --------------------------------
  // 5️⃣ Filter Users
  // --------------------------------
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen w-full flex text-white bg-black">
      {currentUser && (
        <LeftSidebar
          currentUser={currentUser}
          search={search}
          setSearch={setSearch}
          filteredUsers={filteredUsers}
          setSelectedUser={(user) => {
            setSelectedUser(user);
            fetchMessages(user._id);
          }}
          setShowInfo={setShowInfo}
          setCurrentUser={setCurrentUser}
          onlineUsers={onlineUsers}
          unread={unread}
        />
      )}

      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        currentUser={currentUser}
        setMessages={setMessages}
      />

      <UserInfo
        selectedUser={selectedUser}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
      />
    </div>
  );
}