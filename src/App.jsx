import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./Pages/Home/Home";
import Chats from "./Pages/Chat/Chats";
import { Box, useColorMode } from "@chakra-ui/react";

function App() {
  const { colorMode } = useColorMode();

  return (
    <Box className="App" bgColor={ colorMode } >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </Box>
  );
}

export default App;
