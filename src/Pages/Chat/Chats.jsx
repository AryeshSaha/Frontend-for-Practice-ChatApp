import React, { useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { Box } from "@chakra-ui/react";
import MyChats from "../../Components/Chats/MyChats";
import ChatBox from "../../Components/Chats/ChatBox";
import { ChatState } from "../../Context/ChatProvider";

const Chats = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState();

  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <Navbar />}
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </>
  );
};

export default Chats;
