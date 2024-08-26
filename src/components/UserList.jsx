/* eslint-disable react/prop-types */
import UserTile from "./UserTile";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../util/constants";
import { nanoid } from "nanoid";

function UserList(props) {
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([]);
  const [renderPage, setRenderPage] = useState(0);
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
    localStorage.removeItem("token");
    props.renderPage(1, "");
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      props.renderPage(1, "");
    } else {
      axios
        .get(SERVER_URL + "/db/userlist", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          console.log(res.data);
          setRenderPage(1);
          setUsername(res.data.username);
          setUserList(res.data.user_list);
        })
        .catch((err) => {
          console.log(err);
          props.renderPage(1, "");
        });
    }
  }, [props]);
  if (renderPage == 0) return <div>loading...</div>;
  else {
    return (
      <div>
        <span>{"Welcome " + username}</span>
        <div>
          <ul>{userTileList}</ul>
        </div>
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
    );
  }
}

export default UserList;
