import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import SignIn from "./components/SignIn.jsx";
import SignUp from "./components/SignUp.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import UserList from "./components/UserList.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
