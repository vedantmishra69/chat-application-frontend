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
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-50">
      <div className="h-[600px] w-[400px] flex flex-col bg-white shadow-md rounded-lg p-2">
        <div className="bg-white border-b px-4 py-3 flex items-center">
          <button
            onClick={() => setPage("user list")}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex-1">
            <h2 className="poppins-medium text-gray-800">{recepient}</h2>
            <div className="flex items-center">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  status === "online" ? "bg-green-500" : "bg-gray-400"
                } mr-2`}
              ></span>
              <span className="text-sm text-gray-500 capitalize">{status}</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <MessageList
            message={message}
            recepient={recepient}
            username={username}
          />
        </div>
        <div className="border-t p-4">
          <UserInput handleSend={handleSend} />
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
