/* eslint-disable react/prop-types */
function UserTile({ user }) {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
  };

  return (
    <div className="px-6 py-4 flex items-center space-x-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">{user.name}</p>
        <div className="flex items-center mt-1">
          <span
            className={`h-2.5 w-2.5 rounded-full ${statusColors[user.status]} mr-2`}
          ></span>
          <p className="text-sm text-gray-500 capitalize">{user.status}</p>
        </div>
      </div>
    </div>
  );
}

export default UserTile;
