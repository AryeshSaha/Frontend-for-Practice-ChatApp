import React, { useEffect } from "react";
import {
  Box,
  Container,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import Login from "../../Components/Auth/Login";
import SignUp from "../../Components/Auth/SignUp";
import { useNavigate } from "react-router-dom";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const Home = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) navigate("/chats");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <>
      <Container maxW={"xl"} centerContent>
        <Box
          display={"flex"}
          flexDirection={"column"}
          p={3}
          w={"100%"}
          m={"40px 0 15px 0"}
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Box display={"flex"} justifyContent={"flex-end"} mt={1} me={1}>
            <Tooltip
              label={`Change to ${
                colorMode === "light" ? "dark" : "light"
              } mode`}
              borderRadius={15}
            >
              <IconButton
                icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
                fontSize={25}
                bg={"none"}
              />
            </Tooltip>
          </Box>
          <Text display={"flex"} justifyContent={"center"} fontSize={"4xl"}>
            Chat-A-Lot
          </Text>
        </Box>
        <Box w={"100%"} p={4} borderRadius={"lg"} borderWidth={"1px"}>
          <Tabs isFitted variant="soft-rounded" colorScheme="messenger">
            <TabList mb={"1em"}>
              <Tab w={"50%"} color={colorMode}>
                Login
              </Tab>
              <Tab w={"50%"} color={colorMode}>
                Sign Up
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default Home;
