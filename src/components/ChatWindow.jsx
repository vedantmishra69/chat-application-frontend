function ChatWindow() {
  return (
    <div className="h-screen bg-gradient-to-br from-custom-purple to-custom-blue flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden h-full">
        <div className="flex flex-col h-full">
          <div className="bg-custom-purple text-white py-4 px-6">
            <h2 className="text-2xl font-bold">Chat Room</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            <div className="mb-4">
              <div className="flex items-start mb-4">
                <div className="bg-custom-purple text-white rounded-lg px-4 py-2 max-w-xs">
                  <p>Hi! How can I help you today?</p>
                </div>
              </div>
              <div className="flex items-start justify-end mb-4">
                <div className="bg-custom-blue text-white rounded-lg px-4 py-2 max-w-xs">
                  <p>I&apos;m looking for information about your services.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-200 p-4 flex items-center">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-custom-purple"
              type="text"
              placeholder="Type your message..."
            />
            <button
              className="ml-4 bg-custom-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
