import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();
var socket;

const ChatProvider = ({ children }) => {
  const ColorW = "white";
  const ColorB = "black";
  // const url = "http://127.0.0.1:4000";
  const url = "https://backend-practice-chat-app.onrender.com";
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();
  const [notification, setNotification] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    socket = io(url, { transports: ["websocket"], upgrade: false });
    setUser(userInfo);

    if (!userInfo) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        socket,
        url,
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        onlineUsers,
        setOnlineUsers,
        ColorW,
        ColorB,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
