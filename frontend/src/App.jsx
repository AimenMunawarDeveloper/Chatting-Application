import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chats from "./pages/Chats";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} exact></Route>
        <Route path="/chats" element={<Chats />} exact></Route>
      </Routes>
    </Router>
  );
}

export default App;
