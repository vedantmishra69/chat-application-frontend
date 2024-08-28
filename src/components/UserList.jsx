/* eslint-disable react/prop-types */
import UserTile from "./UserTile";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../util/constants";
import { nanoid } from "nanoid";
import socket from "../util/socket";

function UserList(props) {
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([]);
  const [renderPage, setRenderPage] = useState(false);
  const [renderList, setRenderList] = useState(false);
  const [listError, setListError] = useState("");
  const userTileList = userList.map?.((data) => {
    return (
      <div key={nanoid()}>
        <li>
          <UserTile username={data.username} />
        </li>
      </div>
    );
  });
  const handleSignOut = () => {
    if (socket.connected) socket.disconnect();
    localStorage.removeItem("token");
    props.renderPage(1, "");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!renderPage) {
      if (!token) props.renderPage(1, "");
      else {
        axios
          .get(SERVER_URL + "/auth/verify", {
            headers: {
              Authorization: token,
            },
          })
          .then((res) => {
            console.log("Verified: " + res.data.username);
            setUsername(res.data.username);
            setRenderPage(true);
            socket.connect();
            socket.on("connect", () => {
              socket.emit("im on");
            });
            socket.on("connect_error", () => {
              if (!socket.active) socket.connect();
            });
          })
          .catch((err) => {
            console.log("Error in verification: ");
            console.log(err);
            props.renderPage(1, "");
          });
      }
    } else if (!renderList) {
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
          setListError(err.response.data.error);
        });
    }
  }, [renderPage, renderList, props]);
  if (!renderPage) return <div>loading...</div>;
  else {
    return (
      <div className="">
        <div className="">
          <span>{"Welcome " + username}</span>
          <div>{listError}</div>
          <div>
            <ul>{userTileList}</ul>
          </div>
          <div>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserList;
