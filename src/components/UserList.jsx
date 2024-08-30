/* eslint-disable react/prop-types */
import UserTile from "./UserTile";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../util/constants";
import { nanoid } from "nanoid";

function UserList({ username, socket, handleChatWindow }) {
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
          setListError(err.response.data.error);
        });
    } else {
      socket.on("set online", (onlineUser, cb) => {
        const list = {};
        for (const user of userList) {
          if (user === onlineUser) list[user] = "online";
          else list[user] = statusList[user];
        }
        setStatusList(list);
        cb(username);
      });
      socket.on("set offline", (offlineUser, cb) => {
        const list = {};
        for (const user of userList) {
          if (user === offlineUser) list[user] = "offline";
          else list[user] = statusList[user];
        }
        setStatusList(list);
        cb(username);
      });
    }
  }, [renderList, socket, username, userList, statusList]);
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
