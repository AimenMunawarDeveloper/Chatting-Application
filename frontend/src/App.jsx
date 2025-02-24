import { Routes, Route } from "react-router-dom";
import Chats from "./pages/Chats";
import HomePage from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} exact></Route>
      <Route path="/chats" element={<Chats />} exact></Route>
    </Routes>
  );
}

export default App;
