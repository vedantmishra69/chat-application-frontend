/* eslint-disable react/prop-types */
import { useState } from "react";
import ChatWindow from "./ChatWindow";
import UserList from "./UserList";
import { io } from "socket.io-client";

function MainPage({ username, setTopMessage, setProcess }) {
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
  };
  return (
    <div>
      <p>{"Welcome " + username}</p>
      <div className="flex flex-row">
        <div>
          <UserList
            username={username}
            socket={socket}
            handleChatWindow={handleChatWindow}
          />
        </div>
        <div>
          <ChatWindow
            username={username}
            recepient={recepient}
            socket={socket}
          />
        </div>
      </div>
      <div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
}

export default MainPage;
