/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Message from "./Message";
import { nanoid } from "nanoid";

function ChatWindow({ socket, recepient }) {
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const messageBoxList = messageList?.map((obj) => (
    <Message key={nanoid()} user={obj.user} message={obj.message} />
  ));
  const handleSend = () => {
    socket.emit("message sent", message, recepient);
    setMessageList([...messageList, { user: true, message: message }]);
    setMessage("");
  };
  useEffect(() => {
    socket.on("message received", (message, username) => {
      if (username === recepient) {
        setMessageList([...messageList, { user: false, message: message }]);
      }
    });
  }, [messageList, recepient, socket]);
  return (
    <div>
      <div>{recepient}</div>
      <div className="m-1">{messageBoxList}</div>
      <div className="m-1">
        <div>
          <input
            type="text"
            placeholder="your text here"
            onChange={(event) => setMessage(event.target.value)}
            value={message}
          />
        </div>
        <div className="m-4">
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
