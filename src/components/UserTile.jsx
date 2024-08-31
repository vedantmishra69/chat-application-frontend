/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

function UserTile({ user, socket }) {
  const [status, setStatus] = useState("offline");
  useEffect(() => {
    socket.emit("isOnline", user, (isOnline) => {
      if (isOnline) setStatus("online");
    });
  }, [user, socket]);
  return (
    <div className="border m-1 p-1">
      <div>
        <span>{user}</span>
      </div>
      <div>
        <span>{status}</span>
      </div>
    </div>
  );
}

export default UserTile;
