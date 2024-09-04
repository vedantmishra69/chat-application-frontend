/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { addMessage } from "../util/db";
import MessageList from "./MessageList";
import UserInput from "./UserInput";

function ChatWindow({ username, socket, recepient, setPage, recepientStatus }) {
  const [status, setStatus] = useState(recepientStatus);
  const [message, setMessage] = useState(null);
  const handleSend = (message) => {
    socket.emit("message sent", message, recepient, (offset) => {
      addMessage(message, username, recepient, true)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      setMessage({ user: true, message: message });
      socket.auth.offset = offset;
      localStorage.setItem(`${username}-offset`, offset);
    });
  };
  useEffect(() => {
    socket.on("message received", (message, cb) => {
      console.log(message.content + " from " + message.sender);
      cb(JSON.stringify(message));
      addMessage(message.content, message.receiver, message.sender, false)
        .then((res) => {
          console.log(res);
          socket.auth.offset = message.offset;
          localStorage.setItem(`${username}-offset`, message.offset);
        })
        .catch((err) => console.log(err));
      if (message.sender === recepient) {
        setMessage({ user: false, message: message.content });
      }
    });
    socket.on("set online", (onlineUser, cb) => {
      console.log(onlineUser + " is set online");
      if (onlineUser === recepient) setStatus("online");
      cb(username);
    });
    socket.on("set offline", (offlineUser, cb) => {
      console.log(offlineUser + " is set offline");
      if (offlineUser === recepient) setStatus("offline");
      cb(username);
    });
    return () => {
      socket.off("message received");
      socket.off("set online");
      socket.off("set offline");
    };
  }, [recepient, socket, username]);
  return (
    <div>
      <div>
        <button
          onClick={() => {
            setPage("user list");
          }}
        >
          Back
        </button>
      </div>
      <div>{recepient}</div>
      <div>{status}</div>
      <div>
        <MessageList
          message={message}
          recepient={recepient}
          username={username}
        />
      </div>
      <div>
        <UserInput handleSend={handleSend} />
      </div>
    </div>
  );
}

export default ChatWindow;
