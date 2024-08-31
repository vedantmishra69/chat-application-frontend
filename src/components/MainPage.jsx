/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import UserList from "./UserList";
import { io } from "socket.io-client";
import ChatWindow from "./ChatWindow";

const socket = io("http://localhost:3000", {
  auth: { token: localStorage.getItem("token") },
  autoConnect: false,
});

function MainPage({ username, setTopMessage, setProcess }) {
  const [page, setPage] = useState("user list");
  const [recepient, setRecepient] = useState("");
  const handleSignOut = () => {
    localStorage.removeItem("token");
    if (socket.connected) socket.disconnect();
    setTopMessage("");
    setProcess("sign in");
  };
  const handleChatWindow = (recepient) => {
    setRecepient(recepient);
    setPage("chat window");
  };
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("socket is connected");
    });
    socket.on("connect_error", () => {
      socket.connect();
    });
  }, []);
  if (page === "user list") {
    return (
      <div>
        <p>{"Welcome " + username}</p>
        <div>
          <UserList
            username={username}
            socket={socket}
            handleChatWindow={handleChatWindow}
            handleSignOut={handleSignOut}
          />
        </div>
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <ChatWindow
          username={username}
          socket={socket}
          recepient={recepient}
          setPage={setPage}
        />
      </div>
    );
  }
}

export default MainPage;
