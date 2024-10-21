/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import UserList from "./UserList";
import { io } from "socket.io-client";
import ChatWindow from "./ChatWindow";
import axios from "axios";
import { SERVER_URL } from "../util/constants";
import { addMessage } from "../util/db";

const socket = io(SERVER_URL, {
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
  const getOffset = useCallback(() => {
    const offset = localStorage.getItem(`${username}-offset`);
    if (offset) return offset;
    localStorage.setItem(`${username}-offset`, 0);
    return 0;
  }, [username]);
  useEffect(() => {
    socket.auth = {
      token: localStorage.getItem("token"),
    };
    socket.connect();
    console.log("connection initiated");
  }, [username]);
  useEffect(() => {
    if (page === "user list") setRecepient("");
  }, [page]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("requesting from offset " + getOffset());
    axios
      .get(SERVER_URL + "/db/messages", {
        headers: {
          Authorization: token,
        },
        params: {
          offset: getOffset(),
        },
      })
      .then((res) => {
        console.log("unread messages");
        console.log(res.data.messages);
        for (const message of res.data.messages) {
          const _username =
            message.receiver === username ? message.receiver : message.sender;
          const _recepient =
            message.receiver === username ? message.sender : message.receiver;
          const type = message.receiver === username ? false : true;
          addMessage(message.content, _username, _recepient, type)
            .then((res) => {
              localStorage.setItem(`${username}-offset`, message.offset);
              console.log(res);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, [getOffset, username]);

  if (page === "user list") {
    return (
      <div className="min-h-screen flex w-full justify-center items-center bg-gray-50">
        <div className="w-full max-w-md space-y-4 rounded-lg shadow-md py-4 px-4 bg-white">
          <div className="w-full flex justify-center">
            <p className="w-max text-xl poppins-medium">
              {"Welcome " + username}
            </p>
          </div>
          <div>
            <UserList
              username={username}
              socket={socket}
              handleChatWindow={handleChatWindow}
              handleSignOut={handleSignOut}
            />
          </div>
          <button
            onClick={handleSignOut}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Out
          </button>
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
