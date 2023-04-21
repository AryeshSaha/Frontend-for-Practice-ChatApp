import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./Pages/Home/Home";
import Chats from "./Pages/Chat/Chats";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;
