/* eslint-disable react/prop-types */
import { useEffect } from "react";
import ChatWindow from "./ChatWindow";
import UserList from "./UserList";
import socket from "../util/socket";

function MainPage({ username, setTopMessage, setProcess }) {
  const handleSignOut = () => {
    localStorage.removeItem("token");
    if (socket.connected) socket.disconnect();
    setTopMessage("");
    setProcess("sign in");
  };
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      socket.emit("im on");
    });
    socket.on("connect_error", () => {
      if (!socket.active) socket.connect();
    });
  }, []);
  return (
    <div>
      <p>{"Welcome " + username}</p>
      <div className="flex flex-row">
        <div>
          <UserList username={username} />
        </div>
        <div>
          <ChatWindow />
        </div>
      </div>
      <div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
}

export default MainPage;
