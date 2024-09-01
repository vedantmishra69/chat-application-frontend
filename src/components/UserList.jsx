/* eslint-disable react/prop-types */
import UserTile from "./UserTile";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../util/constants";
import { nanoid } from "nanoid";

function UserList({ username, socket, handleChatWindow, handleSignOut }) {
  const [userList, setUserList] = useState([]);
  const [renderList, setRenderList] = useState(false);
  const [listError, setListError] = useState("");
  const userTileList = userList.map?.((user) => {
    return (
      <li key={nanoid()}>
        <div onClick={() => handleChatWindow(user.name)}>
          <UserTile user={user} />
        </div>
      </li>
    );
  });
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
          // const list = [];
          // for (const data of res.data.user_list) {
          //   const user = {
          //     name: data.username,
          //     status: "offline",
          //   };
          //   list.push(user);
          // }
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
  return (
    <div className="">
      <div>{listError}</div>
      <div>
        <ul>{userTileList}</ul>
      </div>
    </div>
  );
}

export default UserList;
