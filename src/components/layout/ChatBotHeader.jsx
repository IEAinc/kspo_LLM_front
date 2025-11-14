import React from 'react';
import logo from "../../assets/img/logo.svg";
import Button from "../commons/Button.jsx";

const ChatBotHeader = () => {
  return (
    <header>
      <a href="/"><img src={`${logo}`} alt="KSPO&CO 한국체육산업개발 사내챗봇"/></a>
      <Button className={"text-view"} text={"크게"} />
    </header>
  )
}

export default ChatBotHeader;
