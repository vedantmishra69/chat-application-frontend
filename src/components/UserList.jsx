import UserTile from "./UserTile";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../util/constants";
import { nanoid } from "nanoid";

function UserList() {
  const [userList, setUserList] = useState([]);
  const [listError, setListError] = useState("");
  const userTileList = userList.map?.((data) => {
    return (
      <li key={nanoid()}>
        <div>
          <UserTile user={data.username} />
        </div>
      </li>
    );
  });
  useEffect(() => {
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
      })
      .catch((err) => {
        console.log(err);
        setListError(err.response.data.error);
      });
  }, []);
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
