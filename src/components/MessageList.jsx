/* eslint-disable react/prop-types */
import { nanoid } from "nanoid";
import Message from "./Message";
import { useEffect, useState, useRef } from "react";
import { getMessages } from "../util/db";

const MessageList = ({ message, recepient, username }) => {
  const [messageList, setMessageList] = useState([]);
  const [pullHistory, setPullHistory] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const messageBoxList = messageList?.map((obj) => {
    if (obj)
      return <Message key={nanoid()} user={obj.user} message={obj.message} />;
  });

  useEffect(() => {
    if (!pullHistory) {
      getMessages(recepient, username)
        .then((res) => {
          console.log(res);
          const list = [];
          for (const message of res) {
            list.push({ user: message.user, message: message.content });
          }
          setMessageList(list);
          setPullHistory(true);
        })
        .catch((err) => console.log(err));
    } else {
      setMessageList((m) => [...m, message]);
    }
  }, [message, pullHistory, recepient, username]);
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 h-full">
      {messageBoxList}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
