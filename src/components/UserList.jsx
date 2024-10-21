/* eslint-disable react/prop-types */
import UserTile from "./UserTile";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../util/constants";
import { nanoid } from "nanoid";
import { addMessage } from "../util/db";

function UserList({ username, socket, handleChatWindow, handleSignOut }) {
  const [userList, setUserList] = useState([]);
  const [renderList, setRenderList] = useState(false);
  const [listError, setListError] = useState("");

  const userTileList = userList.map?.((user) => (
    <li key={nanoid()}>
      <div
        onClick={() => handleChatWindow(user.name, user.status)}
        className="cursor-pointer hover:bg-gray-50 transition-colors duration-150 rounded-lg"
      >
        <UserTile user={user} />
      </div>
    </li>
  ));
  useEffect(() => {
    if (!renderList) {
      const token = localStorage.getItem("token");
      axios
        .get(SERVER_URL + "/db/userlist", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          console.log("list fetched: " + JSON.stringify(res.data.user_list));
          setUserList(res.data.user_list);
          setRenderList(true);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) handleSignOut();
          setListError(err.response.data.error);
        });
    } else {
      socket.on("set online", (onlineUser, cb) => {
        console.log(onlineUser + " is set online");
        setUserList((list) => {
          const newList = [];
          for (const user of list) {
            const updatedUser = {};
            updatedUser.name = user.name;
            updatedUser.status =
              user.name === onlineUser ? "online" : user.status;
            newList.push(updatedUser);
          }
          return newList;
        });
        cb(username);
      });
      socket.on("set offline", (offlineUser, cb) => {
        console.log(offlineUser + " is set offline");
        setUserList((list) => {
          const newList = [];
          for (const user of list) {
            const updatedUser = {};
            updatedUser.name = user.name;
            updatedUser.status =
              user.name === offlineUser ? "offline" : user.status;
            newList.push(updatedUser);
          }
          return newList;
        });
        cb(username);
      });
    }
    return () => {
      socket.off("set online");
      socket.off("set offline");
    };
  }, [renderList, socket, username, userList, handleSignOut]);
  useEffect(() => {
    socket.on("message received", (message, cb) => {
      console.log(
        message.content + " from " + message.sender + " to " + message.receiver,
      );
      cb(message);
      const _username =
        message.receiver === username ? message.receiver : message.sender;
      const recepient =
        message.receiver === username ? message.sender : message.receiver;
      const type = message.receiver === username ? false : true;
      addMessage(message.content, _username, recepient, type)
        .then((res) => {
          socket.auth.offset = message.offset;
          localStorage.setItem(`${username}-offset`, message.offset);
          console.log(res);
        })
        .catch((err) => console.log(err));
    });
    return () => socket.off("message received");
  }, [socket, username]);
  return (
    <div className="w-full max-w-md bg-white rounded-lg overflow-hidden">
      {listError && (
        <div className="px-4 py-2 bg-red-50 text-red-600 text-sm">
          {listError}
        </div>
      )}
      <div className="divide-y divide-gray-200">
        <ul className="overflow-y-auto max-h-[calc(100vh-20rem)]">
          {userTileList}
        </ul>
      </div>
    </div>
  );
}

export default UserList;
