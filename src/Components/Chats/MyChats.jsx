import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, useColorMode, Divider } from "@chakra-ui/react";
import { getSender } from "../../config/ChatLogics";
import ChatLoading from "../Misc/Chat Loading/ChatLoading";
import { ChatState } from "../../Context/ChatProvider";
import GroupChatModal from "../Misc/Group Chat Modals/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const { colorMode } = useColorMode();
  const [loggedUser, setLoggedUser] = useState();

  const {
    url,
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${url}/api/chat`, config);

      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  const notiUpdater = (chat) => {
    setSelectedChat(chat);
    const notis = notification.filter(noti => noti.chat._id !== chat._id)
    setNotification(notis)
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={colorMode}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            leftIcon={<AddIcon />}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>
      <Divider orientation="horizontal" />
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg={colorMode}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => notiUpdater(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#e9e9e9"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.lastMsg && (
                  <Text fontSize="xs">
                    <b>
                      {chat.isGroupChat && chat.lastMsg.sender.name + " : "}
                    </b>
                    {chat.lastMsg.content
                      ? chat.lastMsg.images?.length > 0
                        ? "Photo"
                        : chat.lastMsg.content?.length > 50
                        ? chat.lastMsg.content.substring(0, 51) + "..."
                        : chat.lastMsg.content
                      : "Photo"}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
