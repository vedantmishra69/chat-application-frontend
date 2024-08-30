/* eslint-disable react/prop-types */
function Message({ user, message }) {
  return (
    <div
      className={"border-2 " + (user ? " border-blue-400" : " border-red-400")}
    >
      <div className="m-1">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Message;
