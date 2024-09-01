/* eslint-disable react/prop-types */

function UserTile({ user }) {
  return (
    <div className="border m-1 p-1">
      <div>
        <span>{user.name}</span>
      </div>
      <div>
        <span>{user.status}</span>
      </div>
    </div>
  );
}

export default UserTile;
