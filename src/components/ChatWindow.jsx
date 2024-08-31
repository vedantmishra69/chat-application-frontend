/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { addMessage } from "../util/db";
import MessageList from "./MessageList";
import UserInput from "./UserInput";

function ChatWindow({ username, socket, recepient, setPage }) {
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
    return () => {
      socket.off("message received");
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
