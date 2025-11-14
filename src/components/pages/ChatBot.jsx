import React, { useState } from 'react';
import ChatBotHeader from "../layout/ChatBotHeader.jsx";
import ChatSidebar from "../layout/ChatSidebar.jsx";
import Button from "../commons/Button.jsx";

const ChatBot = () => {
  const [chatInputVal, setChatInputVal] = useState("");
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [chatStart, setChatStart] = useState(false);

  const handleChatInputChange = (e) => {
    setChatInputVal(e.target.value);

    if(e.target.value.length > 0){
      setSendBtnActive(true);
    }else{
      setSendBtnActive(false);
    }
  }

  const handleEnterSend = (e) => {
    if(chatInputVal.length > 0 && e.keyCode === 13){
      console.log("보냄");
      setChatStart(true);
      setSendBtnActive(false);
      setChatInputVal("");
    }
  }

  const handleSendBtnClick = () => {
    if(chatInputVal.length > 0){
      console.log("보냄");
      setChatStart(true);
      setSendBtnActive(false);
      setChatInputVal("");
    }
  }

  return (
    <>
      <div className="chat-bot">
        <ChatSidebar />

        <div className="contents">
          <ChatBotHeader />

          <div className="chat-box">
            <div className="start-chat">필요한 규정 정보를 찾아드릴게요.</div>
            <div className="chat-input-box">
              <Button icon={"plus"} />
              <label>
                <input type="text" placeholder={"규정 및 지침에 대해 궁금하신 내용을 입력해주세요."} value={chatInputVal} onInput={handleChatInputChange} onKeyDown={handleEnterSend}/>
              </label>
              <Button className={`send${sendBtnActive ? " active" : ""}`} icon={"send"} onClick={handleSendBtnClick} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatBot;
