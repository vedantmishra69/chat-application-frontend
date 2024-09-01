/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { addMessage } from "../util/db";
import MessageList from "./MessageList";
import UserInput from "./UserInput";

function ChatWindow({ username, socket, recepient, setPage, recepientStatus }) {
  const [status, setStatus] = useState(recepientStatus);
  const [message, setMessage] = useState(null);
  const handleSend = (message) => {
    socket.emit("message sent", message, recepient, (err) => {
      if (err) {
        console.log(err);
      } else {
        addMessage(message, username, recepient, true)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
        setMessage({ user: true, message: message });
      }
    });
  };
  useEffect(() => {
    socket.on("message received", (message, otherUser, cb) => {
      console.log(message + " from " + otherUser);
      cb(message);
      if (otherUser === recepient) {
        addMessage(message, username, recepient, false)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
        setMessage({ user: false, message: message });
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
