/* eslint-disable react/prop-types */
import { useState } from "react";
import UserList from "./UserList";
import { io } from "socket.io-client";
import ChatWindow from "./ChatWindow";

function MainPage({ username, setTopMessage, setProcess }) {
  const [page, setPage] = useState("user list");
  const [recepient, setRecepient] = useState("");
  const socket = io("http://localhost:3000", {
    auth: { token: localStorage.getItem("token") },
  });
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
  if (page === "user list") {
    return (
      <div>
        <p>{"Welcome " + username}</p>
        <div>
          <UserList
            username={username}
            socket={socket}
            handleChatWindow={handleChatWindow}
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
        <ChatWindow socket={socket} recepient={recepient} setPage={setPage} />
      </div>
    );
  }
}

export default MainPage;
