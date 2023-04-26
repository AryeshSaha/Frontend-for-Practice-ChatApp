import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Text, Box } from "@chakra-ui/layout";
import { AddIcon, ArrowBackIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  FormControl,
  IconButton,
  Input,
  Spinner,
  useColorMode,
  useToast,
  Divider,
  FormLabel,
  Image,
} from "@chakra-ui/react";
import _ from "lodash";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../Misc/ProfileModal/ProfileModal";
import UpdateGroupChatModal from "../Misc/Group Chat Modals/UpdateGroupChatModal";
import axios from "axios";
import { useEffect } from "react";
import Messages from "../Messages/Messages";
import { io } from "socket.io-client";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { colorMode } = useColorMode();
  const {
    url,
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();
  const toast = useToast();

  // to identify if the sockets are connected
  const [socketCon, setSocketCon] = useState(false);
  const [loading, setLoading] = useState(false);
  // input of every single new msg
  const [newMsg, setNewMsg] = useState("");
  // input of every single new img
  const [newImg, setNewImg] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  // to keep the messages
  const [msgs, setMsgs] = useState([]);
  // to change typing state from client 1 to server
  const [typing, setTyping] = useState(false);
  // to display changed typing state from server to client 2
  const [isTyping, setIsTyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `${url}/api/msg/${selectedChat._id}`,
        config
      );

      setMsgs(data);
      setLoading(false);

      // socket is trying to send the event "join room" to the server for permission to enter a room to communicate with users
      socket.emit("join room", selectedChat, user);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSubmit = async () => {
    if (newMsg) {
      socket.emit("stop typing", selectedChat);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          `${url}/api/msg`,
          {
            content: newMsg,
            chatId: selectedChat._id,
          },
          config
        );

        // socket is trying to send the event of sending msg to the server so that the server can send the data to the receiver.
        socket.emit("sendMsg", data, selectedChat._id);

        setMsgs([...msgs, data]);
        setNewMsg("");
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const sendMsg = async (event) => {
    if (event.key === "Enter" && newMsg) {
      socket.emit("stop typing", selectedChat);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `${url}/api/msg`,
          {
            content: newMsg,
            chatId: selectedChat._id,
          },
          config
        );

        // socket is trying to send the event of sending msg to the server so that the server can send the data to the receiver.
        socket.emit("sendMsg", data);

        setMsgs([...msgs, data]);
        setNewMsg("");
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const showNotification = (title, options) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, options);
      });
    }
  }

  useEffect(() => {
    socket = io(url, { transports: ["websocket"], upgrade: false });

    socket.emit("setup", user);

    socket.on("connected", () => {
      setSocketCon(true);
    });

    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });

    // Check whether browser supports notifications
    if ('Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        // This code will request permission to show notifications if the user has not already granted or denied permission.
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Notification permission granted');
          } else {
            console.log('Notification permission denied');
          }
        });
      }
    }
  
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.off("receiveMsg");
    socket.on("receiveMsg", (msg) => {
      if (!selectedChatCompare || selectedChatCompare._id !== msg.chat._id) {
        // give noti
        if (!notification.includes(msg)) {
          setNotification([msg, ...notification]);
          setFetchAgain(!fetchAgain);
          if (Notification.permission === "granted") {
            showNotification("New message received", {
              body: "You have a new message from " + msg.sender.name,
              icon: msg.sender.profilePic,
            });
          }
        }
      } else {
        setMsgs([...msgs, msg]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMsg(e.target.value);

    if (!socketCon) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat);
    }
    let lastTypingTime = new Date().getTime();
    var timer = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();

      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timer && typing) {
        socket.emit("stop typing", selectedChat);
        setTyping(false);
      }
    }, timer);
  };

  // Task for single image first
  // Upload button
  // Preview for the selected image
  // Add caption for the selected image in the preview tab to send with the image
  // upload to cloudinary folder
  // send secure_url of that image to the server
  // access and display the image in the chat in some way
  // then try the same for multiple images

  const handleImg = (e) => {
    setNewImg(e.target.files[0]);
    setImgUrl(URL.createObjectURL(e.target.files[0]));
  };

  const sendImg = async () => {
    if (newImg) {
      const formData = new FormData();

      formData.append("file", newImg);
      formData.append("upload_preset", "chat-app");
      formData.append("folder", `ChatMedia/${selectedChat._id}`);

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/aryesh/image/upload",
          formData
        );
        setNewImg(null);

        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          `${url}/api/msg`,
          {
            image: res?.data?.secure_url,
            chatId: selectedChat._id,
          },
          config
        );

        // socket is trying to send the event of sending msg to the server so that the server can send the data to the receiver.
        socket.emit("sendMsg", data);

        setMsgs([...msgs, data]);

        setImgUrl("");
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Media",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {_.startCase(getSender(user, selectedChat.users))}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {_.startCase(selectedChat.chatName)}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Divider orientation="horizontal" />
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={colorMode}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {/* Messages */}
            {loading ? (
              <Spinner
                size={"xl"}
                w={10}
                h={10}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <Box
                display={"flex"}
                flexDir={"column"}
                overflowY={"scroll"}
                style={{ scrollbarWidth: "none" }}
              >
                {/* Messages */}
                <Messages msgs={msgs} />
              </Box>
            )}

            {/* Preview Images */}
            {imgUrl ? (
              <Box display={"flex"} justifyContent={"start"} alignItems={"end"}>
                <Image boxSize={"100px"} src={imgUrl} alt="image" />
                <ArrowRightIcon
                  color={colorMode}
                  fontSize={"xl"}
                  mx={3}
                  onClick={sendImg}
                />
              </Box>
            ) : (
              <></>
            )}

            {isTyping ? <Text color={colorMode}>typing...</Text> : <></>}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              {/* Image Input */}
              <FormControl w={"auto"}>
                <FormLabel htmlFor="dp" w={"auto"} mt={3} me={4}>
                  <AddIcon fontSize={"20px"} />
                </FormLabel>
                <Input
                  type="file"
                  id="dp"
                  accept="image/*"
                  display={"none"}
                  onChange={handleImg}
                />
              </FormControl>

              <FormControl
                onKeyDown={sendMsg}
                mt={3}
                display={"flex"}
                alignItems={"center"}
              >
                <Input
                  variant={"outline"}
                  bg={colorMode}
                  placeholder="Enter a message..."
                  value={newMsg}
                  onChange={typingHandler}
                />
                <ArrowRightIcon
                  display={{ base: "flex", lg: "none" }}
                  color={colorMode}
                  fontSize={"2xl"}
                  mx={5}
                  onClick={handleSubmit}
                />
              </FormControl>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={"center"}
            h={"100%"}
          >
            <Text fontSize={"3xl"} pb={3} fontFamily={"Work Sans"}>
              Click on a user to start chatting
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default SingleChat;
