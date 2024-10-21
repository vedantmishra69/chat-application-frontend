/* eslint-disable react/prop-types */
function Message({ user, message }) {
  return (
    <div className={`flex ${user ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          user
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        <p className="text-sm break-words">{message}</p>
      </div>
    </div>
  );
}

export default Message;
