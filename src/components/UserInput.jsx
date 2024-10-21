/* eslint-disable react/prop-types */
import { useState } from "react";

function UserInput({ handleSend }) {
  const [input, setInput] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      handleSend(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={sendMessage} className="flex w-full gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 min-w-0 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="flex-none px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
      >
        Send
      </button>
    </form>
  );
}

export default UserInput;
