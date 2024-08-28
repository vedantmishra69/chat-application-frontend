/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import socket from "../util/socket";

function UserTile({ user }) {
  const [status, setStatus] = useState("offline");
  useEffect(() => {
    console.log("Socket is connected:" + socket.connected);
    socket.onAny((event, ...args) => {
      console.log(event);
      console.log(args);
    });
    socket.emit("isOnline", user, (isOnline) => {
      if (isOnline) setStatus("online");
    });
    socket.on("set offline", (username) => {
      if (username == user) setStatus("offline");
    });
    socket.on("set online", (username) => {
      console.log("recieved: " + username);
      if (username == user) setStatus("online");
    });
    return () => {
      socket.off("set offline");
      socket.off("set online");
    };
  }, [user]);
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
