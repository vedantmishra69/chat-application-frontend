/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import socket from "../util/socket";

function UserTile(props) {
  const [status, setStatus] = useState("offline");
  const handleOnClick = () => {};
  useEffect(() => {
    console.log("Socket is connected:" + socket.connected);
    socket.onAny((event, ...args) => {
      console.log(event);
      console.log(args);
    });
    socket.emit("isOnline", props.username, (isOnline) => {
      if (isOnline) setStatus("online");
    });
    socket.on("set offline", (username) => {
      if (username == props.username) setStatus("offline");
    });
    socket.on("set online", (username) => {
      console.log("recieved: " + username);
      if (username == props.username) setStatus("online");
    });
    return () => {
      socket.off("set offline");
      socket.off("set online");
    };
  }, [props]);
  return (
    <div className="border m-1 p-1" onClick={handleOnClick}>
      <div>
        <span>{props.username}</span>
      </div>
      <div>
        <span>{status}</span>
      </div>
    </div>
  );
}

export default UserTile;
