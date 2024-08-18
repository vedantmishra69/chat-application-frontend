import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import SignIn from "./components/SignIn.jsx";
import SignUp from "./components/SignUp.jsx";
import ChatWindow from "./components/ChatWindow.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SignIn />
  </StrictMode>,
);
