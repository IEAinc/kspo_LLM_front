import React, { useState } from 'react';
import Button from "../commons/Button.jsx";
import HistoryItems from "../commons/HistoryItems.jsx";

const ChatSidebar = () => {
  const [sidebarClose, setSidebarClose] = useState(false);

  let list = [
    { title: "채팅히스토리2", active: false, contents: "대화내용2" },
    { title: "채팅히스토리1", active: false, contents: "대화내용1" },
  ];
  const [chatList, setChatList] = useState(list);

  const handleSidebarClose = () => {
    setSidebarClose(!sidebarClose);
  }

  const handleNewChat = () => {
    setChatList((prevChatList) => {
      const nextIndex = prevChatList.length + 1;
      const newItem = {
        title: `채팅히스토리${nextIndex}`,
        active: false,
        contents: "",
      };

      return [newItem, ...prevChatList];
    });
  };

  return (
    <div className={`sidebar${sidebarClose ? " close" : ""}`}>
      <div className="top">
        <Button icon={"menu"} onClick={handleSidebarClose} />
        <Button className={`new-chat${sidebarClose ? " btn-text-hide" : ""}`} icon={"write"} text={"새 채팅"} contained onClick={() => handleNewChat()} />
      </div>

      <div className={`history-list${sidebarClose ? " hide" : ""}`}>
        <h3>채팅</h3>
        <ul>
          { chatList.map((item, index) => (
            <HistoryItems key={index} item={item} index={index} setChatList={setChatList} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ChatSidebar;
