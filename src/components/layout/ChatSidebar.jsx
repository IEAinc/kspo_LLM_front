import React, { useState } from 'react';
import Button from "../commons/Button.jsx";
import HistoryItems from "../commons/HistoryItems.jsx";

const ChatSidebar = (props) => {
  const [sidebarClose, setSidebarClose] = useState(false);

  /* 사이드바 열고 닫기 */
  const handleSidebarClose = () => {
    setSidebarClose(!sidebarClose);
  }

  /* 새 채팅 클릭 */
  const handleNewChat = () => {
    props.setChatLoad([]);
    props.setChatStart(false);
    props.setActiveIndex(null);
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
          { props.chatHistoryList.map((item, index) => (
            <HistoryItems
              key={index}
              item={item}
              index={index}
              http={props.http}
              chatHistoryList={props.chatHistoryList}
              setChatHistoryList={props.setChatHistoryList}
              setChatStart={props.setChatStart}
              setChatLoad={props.setChatLoad}
              activeIndex={props.activeIndex}
              setActiveIndex={props.setActiveIndex}
              chatViewRef={props.chatViewRef}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ChatSidebar;
