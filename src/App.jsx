import Message from "./components/Message";
import "./App.css";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

const clientId = nanoid();

const socket = io("http://localhost:5000");

function App() {
  const [messageArray, setMessageArray] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  function handleSend(event) {
    event.preventDefault();
    if (currentMessage) {
      socket.emit("chat message", currentMessage, clientId);
      const newMessage = {
        id: `${nanoid()}`,
        content: currentMessage,
        type: 1,
      };
      setCurrentMessage("");
      setMessageArray([...messageArray, newMessage]);
    }
  }

  const messageList = messageArray?.map((message) => (
    <Message content={message.content} type={message.type} key={message.id} />
  ));

  useEffect(() => {
    socket.on("chat message", (message, senderId) => {
      console.log(message);
      console.log(senderId);
      if (senderId !== clientId) {
        const newMessage = {
          id: `${nanoid()}`,
          content: message,
          type: 0,
        };
        console.log(newMessage);
        setMessageArray([...messageArray, newMessage]);
      }
    });

    return () => {
      socket.off("chat message");
    };
  }, [messageArray]);

  return (
    <div className="chat-container">
      <div className="chat-header">Chat App</div>
      <div className="chat-messages">{messageList}</div>
      <form onSubmit={handleSend}>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={currentMessage}
            onChange={(event) => setCurrentMessage(event.target.value)}
          />
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}

export default App;
