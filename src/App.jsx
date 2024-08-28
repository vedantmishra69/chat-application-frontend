import "./App.css";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ChatWindow from "./components/ChatWindow";
import axios from "axios";
import { SERVER_URL } from "./util/constants";
import UserList from "./components/UserList";
// import { io } from "socket.io-client";

// const clientId = nanoid();

// const socket = io("http://localhost:5000");

function App() {
  const [renderPage, setRenderPage] = useState(0);
  const [homePageMessage, setHomePageMessage] = useState("loading");
  const handleRenderPage = (page, message) => {
    setRenderPage(page);
    setHomePageMessage(message);
  };
  if (renderPage == 0)
    return (
      <div>
        <UserList renderPage={handleRenderPage} />
      </div>
    );
  else if (renderPage == 1)
    return <SignIn renderPage={handleRenderPage} message={homePageMessage} />;
  else if (renderPage == 2)
    return <SignUp renderPage={handleRenderPage} message={homePageMessage} />;
  else return <div>{homePageMessage}</div>;
}

export default App;
