import React from 'react';
import logo from "../../assets/img/logo.svg";
import Button from "../commons/Button.jsx";

const ChatBotHeader = (props) => {

  const handleTextSize = (e) => {
    if(e.target.textContent === "크게"){
      props.setTextSize("작게");
    }else if(e.target.textContent === "작게"){
      props.setTextSize("보통");
    }else{
      props.setTextSize("크게");
    }
  }
  return (
    <header>
      <div>
        <Button icon={"menu"} onClick={props.handleSidebarClose} />
        <a href="/"><img src={`${logo}`} alt="KSPO&CO 한국체육산업개발 사내챗봇"/></a>
      </div>
      <Button className={"text-view"} text={props.textSize} onClick={handleTextSize} />
    </header>
  )
}

export default ChatBotHeader;
