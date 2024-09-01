/* eslint-disable react/prop-types */
import UserTile from "./UserTile";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../util/constants";
import { nanoid } from "nanoid";

function UserList({ username, socket, handleChatWindow, handleSignOut }) {
  const [userList, setUserList] = useState([]);
  const [statusList, setStatusList] = useState({});
  const [renderList, setRenderList] = useState(false);
  const [listError, setListError] = useState("");
  const userTileList = userList.map?.((data) => {
    return (
      <li key={nanoid()}>
        <div onClick={() => handleChatWindow(data.username)}>
          <UserTile
            user={data.username}
            status={statusList[data.username]}
            socket={socket}
          />
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
          setUserList(res.data.user_list);
          const list = {};
          for (const username of res.data.user_list) {
            list[username] = "offline";
          }
          setStatusList(list);
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
        setStatusList((list) => {
          const newList = {};
          for (const user of userList) {
            if (user === onlineUser) newList[user] = "online";
            else newList[user] = list[user];
          }
          return newList;
        });
        cb(username);
      });
      socket.on("set offline", (offlineUser, cb) => {
        console.log(offlineUser + " is set offline");
        setStatusList((list) => {
          const newList = {};
          for (const user of userList) {
            if (user === offlineUser) newList[user] = "offline";
            else newList[user] = list[user];
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
