import Message from "./Message";

function ChatWindow() {
  return (
    <div>
      <div className="m-1">
        <Message />
        <Message />
      </div>
      <div className="m-1">
        <div>
          <input type="text" placeholder="your text here" />
        </div>
        <div className="m-4">
          <button>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
