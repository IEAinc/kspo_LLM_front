import React, { useState } from 'react';
import ChatBotHeader from "../layout/ChatBotHeader.jsx";
import ChatSidebar from "../layout/ChatSidebar.jsx";
import Button from "../commons/Button.jsx";
import SendBalloon from "../commons/chat/SendBalloon.jsx";
import AnswerText from "../commons/chat/AnswerText.jsx";
import AnswerDropdown from "../commons/chat/AnswerDropdown.jsx";

const ChatBot = () => {
  const [chatInputVal, setChatInputVal] = useState("");
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [chatStart, setChatStart] = useState(false);
  const [textSize, setTextSize] = useState("크게");
  const [sendMessage, setSendMessage] = useState("");
  const [accordionList, setAccordionList] = useState([
    { open: false, title: "62-스포츠문화교실운영지침", subTitle: "제 14조의 2 (이용료의 할인) 제1항", content: "① 운영자는 「스포츠센터 회원이용약관」 제12조에서 정한 회비 할인제도 이외에 다음 각 호의 할인제도를 운영할 수 있으나, 「스포츠센터 회원이용약관」 제12조에서 정한 할인제도와 중복하여 적용하지 않는다.(’12.7.24 신설, ’15.7.3, ‘16.4.19, ’22.12.28 개정)\n1. 직원 할인 : 공단, 체육산업 임직원(모든 종사원 포함), 협력업체 직원이 회원 등록시 회비의 50% 할인율을 적용한다.\n2. 직원 가족 할인 : 공단, 체육산업 임직원의 가족이 회원으로 등록할 경우 회비의 30% 할인율을 적용한다.\n3. (’15.7.3 삭제)\n4. 유관기관(단체) 직원 할인 : 센터별로 관공서 등 유관기관의 요청이 있는 경우 또는 판촉 및 매출 증대를 위하여 센터에서 필요한 경우 50% 이내에서 할인율을 적용하되, 대상종목 및 할인율은 센터별로 자율적으로 정한다.(’15.7.3 개정)" },
    { open: false, title: "62-스포츠문화교실운영지침", subTitle: "제 14조의 2 (이용료의 할인) 제1항", content: "① 운영자는 「스포츠센터 회원이용약관」 제12조에서 정한 회비 할인제도 이외에 다음 각 호의 할인제도를 운영할 수 있으나, 「스포츠센터 회원이용약관」 제12조에서 정한 할인제도와 중복하여 적용하지 않는다.(’12.7.24 신설, ’15.7.3, ‘16.4.19, ’22.12.28 개정)\n1. 직원 할인 : 공단, 체육산업 임직원(모든 종사원 포함), 협력업체 직원이 회원 등록시 회비의 50% 할인율을 적용한다." },
  ])

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
      setSendMessage(chatInputVal);
    }
  }

  const handleSendBtnClick = () => {
    if(chatInputVal.length > 0){
      console.log("보냄");
      setChatStart(true);
      setSendBtnActive(false);
      setChatInputVal("");
      setSendMessage(chatInputVal);
    }
  }

  return (
    <>
      <div className={`chat-bot${textSize === "작게" ? " large" : textSize === "보통" ? " small" : ""}`}>
        <ChatSidebar />

        <div className="contents">
          <ChatBotHeader textSize={textSize} setTextSize={setTextSize} />

          <div className={`chat-box${chatStart ? " active" : ""}`}>
            <div className="inner">
              {!chatStart ?
                <>
                  <div className="start-chat">필요한 규정 정보를 찾아드릴게요.</div>
                </>
                :
                <>
                  <div className="chat-view">
                    <div className="chat-date">2025.11.11 화요일</div>
                    <SendBalloon sendMessage={sendMessage} />
                    <div className="answer">
                      <AnswerText text={"스포츠·문화교실에서는 임직원과 가족, 유관기관 직원에게 아래와 같은 할인 제도를 운영하고 있습니다."} />
                      <div className="number-answer">
                        <ul>
                          <li>
                            <h4>1. 직원 할인</h4>
                            <p>공단 및 체육산업 임직원(모든 종사원 포함)은 회원 드록 시 회비의 50%가 할인됩니다.</p>
                          </li>
                          <li>
                            <h4>2. 직원 할인</h4>
                            <p>공단 및 체육산업 임직원(모든 종사원 포함)은 회원 드록 시 회비의 50%가 할인됩니다.</p>
                          </li>
                          <li>
                            <h4>3. 직원 할인</h4>
                            <p>공단 및 체육산업 임직원(모든 종사원 포함)은 회원 드록 시 회비의 50%가 할인됩니다.</p>
                          </li>
                        </ul>
                      </div>
                      <AnswerDropdown text={"※ 할인제도는 「스포츠센터 회원이용약관의 기본 할인 외에 센터별로 추가 운영할 수 있으며, 신규 제도 신설이나 할인율 변경 시에는 대표이사 결재 후 시행해야 합니다.」"} accordionList={accordionList} setAccordionList={setAccordionList} />
                      <div className="rating btn-wrap">
                        <Button className={"like"} icon={"like"} />
                        <Button className={"dislike"} icon={"dislike"} />
                      </div>
                    </div>
                  </div>
                </>
              }
            </div>
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
