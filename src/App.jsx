import "./App.css";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ChatWindow from "./components/ChatWindow";
import axios from "axios";
import { SERVER_URL } from "./util/constants";

// const clientId = nanoid();

// const socket = io("http://localhost:5000");

function App() {
  const [renderPage, setRenderPage] = useState(0);
  const [homePageMessage, setHomePageMessage] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRenderPage(1);
      setHomePageMessage("");
    } else {
      axios
        .post(SERVER_URL + "/auth/verify", {
          token: token,
        })
        .then((res) => {
          console.log(res.data.message);
          setRenderPage(0);
          setHomePageMessage(res.data.message);
        })
        .catch((err) => {
          console.log(err.response.data.error);
          setRenderPage(1);
          setHomePageMessage("");
        });
    }
  }, []);
  const handleRenderPage = (page, message) => {
    setRenderPage(page);
    setHomePageMessage(message);
  };
  if (renderPage == 0) return <div>{homePageMessage}</div>;
  else if (renderPage == 1)
    return <SignIn renderPage={handleRenderPage} message={homePageMessage} />;
  else if (renderPage == 2)
    return <SignUp renderPage={handleRenderPage} message={homePageMessage} />;
  else return <div>{homePageMessage}</div>;
}

export default App;
