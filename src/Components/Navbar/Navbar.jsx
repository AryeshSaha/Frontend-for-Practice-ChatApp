import {
  BellIcon,
  ChevronDownIcon,
  MoonIcon,
  Search2Icon,
  SunIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ProfileModal from "../Misc/ProfileModal/ProfileModal";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import ChatLoading from "../Misc/Chat Loading/ChatLoading";
import UserListItem from "../Misc/Users List Item/UserListItem";
import axios from "axios";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import Effect from "react-notification-badge/lib/components/Effect";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    url,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();
  const toast = useToast();

  const logoutHandler = async () => {
    if (user.isOnline) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `${url}/api/user/logout`,
          config
        );
        if (!data.isOnline) {
          localStorage.removeItem("userInfo");
          toast({
            title: "Logout Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          navigate("/");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${url}/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${url}/api/chat/`, { userId }, config);

      if (Array.isArray(chats) && !chats.find((chat) => chat._id === data._id))
        setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg={colorMode}
        w="100%"
        p="5px 10px 5px 10px"
      >
        {/* Search Component */}
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} color={colorMode}>
            <Search2Icon />
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        {/* App Title */}
        <Text display={{ base: "none", md: "flex" }} fontSize="xl">
          Chat-A-Lot
        </Text>

        {/* Menu */}
        <div>
          <Menu>
            {/* Theme */}
            <MenuButton
              onClick={toggleColorMode}
              fontSize={"1.5rem"}
              p={1}
              mr={{ base: "2", md: "4" }}
            >
              {colorMode === "dark" ? <SunIcon mt={1} /> : <MoonIcon mt={1} />}
            </MenuButton>
          </Menu>
          <Menu>
            {/* Notification */}
            <MenuButton p={1} mr={{ base: "1", md: "3" }}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={"1.9rem"} />
            </MenuButton>
            <MenuList>
              {!notification?.length && "No New Messages"}
              {notification?.map((noti) => (
                <MenuItem
                  key={noti._id}
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    setNotification(notification.filter((n) => n !== noti));
                  }}
                >
                  {noti.chat?.isGroupChat
                    ? `New Message in ${noti.chat.chatName}`
                    : `New Message from ${getSender(user, noti.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Profile */}
          <Menu>
            <MenuButton as={Button} bg="none" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={user?.profilePic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal profile={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Divider orientation="horizontal" />

      {/* Side Drawer */}
      <div>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px" onClick={onClose}>
              Search Users
            </DrawerHeader>
            <DrawerBody>
              <Box display="flex" pb={2}>
                <Input
                  placeholder="Search by name or email"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner ml="auto" display="flex" />}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

export default Navbar;
