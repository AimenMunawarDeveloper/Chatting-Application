import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ChatProvider } from "./Context/ChatProvider.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <ChatProvider>
      <App />
    </ChatProvider>
  </Router>
);
