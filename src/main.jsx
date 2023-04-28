import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./Context/ChatProvider";
import { BrowserRouter } from "react-router-dom";

// service worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../sw.js")
      .then((registration) => {
        console.log("ServiceWorker registered: ", registration);
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <BrowserRouter>
      <ChatProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>
  </>
);
