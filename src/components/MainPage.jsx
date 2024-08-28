import ChatWindow from "./ChatWindow";
import UserList from "./UserList";

function MainPage() {
  return (
    <div>
      <div>
        <div>
          <UserList />
        </div>
        <div>
          <ChatWindow />
        </div>
      </div>
      <div>
        <button>Sign Out</button>
      </div>
    </div>
  );
}

export default MainPage;
