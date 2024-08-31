import { useState } from "react";

/* eslint-disable react/prop-types */
const UserInput = ({ handleSend }) => {
  const [message, setMessage] = useState("");
  return (
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
        <button
          onClick={() => {
            handleSend(message);
            setMessage("");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default UserInput;
