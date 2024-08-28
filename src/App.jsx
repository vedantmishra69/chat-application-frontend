import "./App.css";
import { useEffect, useState } from "react";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import axios from "axios";
import { SERVER_URL } from "./util/constants";
import LoadingPage from "./components/LoadingPage";
import MainPage from "./components/MainPage";

function App() {
  const [username, setUsername] = useState("");
  const [process, setProcess] = useState("token verify");
  const [message, setMessage] = useState("");
  const verifyToken = (token) => {
    axios
      .get(SERVER_URL + "/auth/verify", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data.username);
        setUsername(res.data.username);
        setProcess("user verified");
      })
      .catch((err) => {
        console.log(err);
        setProcess("sign in");
      });
  };
  useEffect(() => {
    if (process === "token verify") {
      const token = localStorage.getItem("token");
      console.log(token);
      if (token) {
        verifyToken(token);
      } else setProcess("sign in");
    }
  }, [username, process]);
  switch (process) {
    case "token verify":
      return <LoadingPage />;
    case "user verified":
      return (
        <MainPage
          username={username}
          setProcess={setProcess}
          setTopMessage={setMessage}
        />
      );
    case "sign in":
      return (
        <SignIn
          topMessage={message}
          setProcess={setProcess}
          setUser={setUsername}
          setTopMessage={setMessage}
        />
      );
    case "sign up":
      return (
        <SignUp
          topMessage={message}
          setProcess={setProcess}
          setTopMessage={setMessage}
        />
      );
  }
}

export default App;
