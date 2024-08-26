/* eslint-disable react/prop-types */
function UserTile(props) {
  return (
    <div className="border m-1 p-1">
      <div>
        <span>{props.username}</span>
      </div>
      <div>
        <span>status</span>
      </div>
    </div>
  );
}

export default UserTile;
