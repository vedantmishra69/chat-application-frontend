/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import UserList from "./UserList";
import { io } from "socket.io-client";
import ChatWindow from "./ChatWindow";

const socket = io("http://localhost:3000", {
  autoConnect: false,
});
const connectSocket = () => {
  if (!socket.connected) socket.connect();
};
const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

socket.on("disconnect", (reason) => {
  console.log(`Socket disconnected due to: ${reason}`);

  if (reason === "io client disconnect") {
    console.log("Disconnected manually by the client.");
  } else if (reason === "io server disconnect") {
    console.log("Disconnected by the server.");
    setTimeout(() => {
      connectSocket();
    }, 5000);
  } else {
    console.log("Disconnected due to network issues or other errors.");
    setTimeout(() => {
      connectSocket();
    }, 5000);
  }
});

socket.on("connect", () => {
  console.log("Connected to the server.");
});

socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
  setTimeout(() => {
    connectSocket();
  }, 5000);
});

function MainPage({ username, setTopMessage, setProcess }) {
  const [page, setPage] = useState("user list");
  const [recepient, setRecepient] = useState("");
  const [recepientStatus, setRecepientStatus] = useState("");
  const handleSignOut = () => {
    localStorage.removeItem("token");
    if (socket.connected) disconnectSocket();
    setTopMessage("");
    setProcess("sign in");
  };
  const handleChatWindow = (recepient, status) => {
    setRecepient(recepient);
    setRecepientStatus(status);
    setPage("chat window");
  };
  useEffect(() => {
    socket.auth = { token: localStorage.getItem("token") };
    socket.connect();
    console.log("connection initiated");
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
          recepientStatus={recepientStatus}
          socket={socket}
          recepient={recepient}
          setPage={setPage}
        />
      </div>
    );
  }
}

export default MainPage;
