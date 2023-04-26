import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./Pages/Home/Home";
import Chats from "./Pages/Chat/Chats";
import { Box, useColorMode } from "@chakra-ui/react";

function App() {
  const { colorMode } = useColorMode();

  // service worker registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service worker registered:', registration);
        })
        .catch(error => {
          console.log('Service worker registration failed:', error);
        });
    });
  }  

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
