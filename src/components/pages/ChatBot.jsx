import React, { useEffect, useRef, useState } from 'react';
import ChatBotHeader from "../layout/ChatBotHeader.jsx";
import ChatSidebar from "../layout/ChatSidebar.jsx";
import Button from "../commons/Button.jsx";
import SendBalloon from "../commons/chat/SendBalloon.jsx";
import AnswerText from "../commons/chat/AnswerText.jsx";
import AnswerDropdown from "../commons/chat/AnswerDropdown.jsx";
import {API_ENDPOINT, generateRandomString} from "../../assets/api/commons.js";
import WaitProgressBar from "../commons/chat/WaitProgressBar.jsx";
import LikesBtn from "../commons/chat/LikesBtn.jsx";
import ErrorBalloon from "../commons/chat/ErrorBalloon.jsx";

/**
 * @property {string} citations
 */

const ChatBot = ({ http }) => {
  const [sidebarClose, setSidebarClose] = useState(true);
  const [chatInputVal, setChatInputVal] = useState("");
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [chatStart, setChatStart] = useState(false);
  const [textSize, setTextSize] = useState("크게");
  const [chatHistoryList, setChatHistoryList] = useState([]);
  const [chatLoad, setChatLoad] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const chatViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  /* 메시지 입력 시 값 저장 및 버튼 활성화 */
  const handleChatInputChange = (e) => {
    setChatInputVal(e.target.value);

    if(e.target.value.length > 0){
      setSendBtnActive(true);
    }else{
      setSendBtnActive(false);
    }
  }

  /* 메세지 전송 */
  const chatSendProcess = async () => {
    setSendBtnActive(false);
    setChatInputVal("");
    setLoading(true);

    /* 보낸 메세지 바로 출력 */
    let sendData = [{ type: "USER", content: chatInputVal}]
    setChatLoad((prevChatLoad) => [...prevChatLoad, ...sendData]);

    /* 채팅룸 ID 랜덤 생성 */
    let createRoomId = generateRandomString();

    try {
      if (!chatStart) {
        /* 새 채팅일 경우 */
        setChatStart(true);

        const response = await http.post(API_ENDPOINT.CHAT_QUERY, {
          type: "USER",
          content: chatInputVal,
          chatRoomId: createRoomId
        });

        setChatLoad((prevChatLoad) => [...prevChatLoad, response.data.response]);

        const roomsRes = await http.get(API_ENDPOINT.ALL_ROOM);
        setChatHistoryList(roomsRes.data.response.reverse());
        setActiveIndex(0);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      } else {
        const response = await http.post(API_ENDPOINT.CHAT_QUERY, {
          type: "USER",
          content: chatInputVal,
          chatRoomId: chatHistoryList[0].chatRoomId
        });

        setChatLoad((prevChatLoad) => [...prevChatLoad, response.data.response]);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    } catch (e) {
      console.error(e);
      setChatLoad((prevChatLoad) => [
        ...prevChatLoad,
        {
          type: "ERROR",
          content: "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  /* 입력창 엔터 키 입력 시 전송 */
  const handleEnterSend = (e) => {
    if(chatInputVal.length > 0 && e.keyCode === 13){
      chatSendProcess();
    }
  }

  /**
   * Markdown 텍스트 파서
   * 각 수평선을 기준으로 <div></div><hr/><div></div> 형태로 변환
   * --- : 수평선
   * **텍스트** : 굵은 글씨
   * \n : 줄바꿈
   */
  const textParser = (text) => {
    // `---` 주변을 표준화: 앞뒤 공백/줄바꿈을 제거하고 `\n---\n`로 통일
    const normalized = text.replace(/\s*-{3,}\s*/g, '\n---\n');
    const lines = normalized.split('\n');
    const elements = [];
    let currentLines = [];
    let keyCounter = 0;

    const parseLineToSpan = (line) => {
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={`b-${keyCounter++}`}>{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }
      return <span key={`s-${keyCounter++}`}>{parts}<br/></span>;
    };

    lines.forEach((line) => {
      if (line.trim() === '---') {
        elements.push(<div key={`div-${keyCounter++}`}>{currentLines.map(parseLineToSpan)}</div>);
        currentLines = [];
      } else {
        currentLines.push(line);
      }
    });

    elements.push(<div key={`div-${keyCounter++}`}>{currentLines.map(parseLineToSpan)}</div>);

    return elements;
  }

  /* 입력창 값 입력 후 버튼 클릭 시 전송 */
  const handleSendBtnClick = () => {
    if(chatInputVal.length > 0){
      chatSendProcess();
    }
  }

  const handleSidebarClose = () => {
    setSidebarClose(!sidebarClose);
  }

  /* 새 채팅 및 채팅 시 마다 리스트 업데이트 */
  useEffect(() => {
    /* 스크롤 내리기 */
    if(chatViewRef.current){
      chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight;
    }
  },[chatLoad]);

  /* 처음 화면 로딩 시 채팅 목록이 있으면 첫번째 요소 하이라이트 */
  useEffect(() => {
    try{
      http.get(API_ENDPOINT.ALL_ROOM)
      .then((response) => {
        setChatHistoryList(response.data.response.reverse());

        // 2025-12-12 하이라이트 제거
        // if(response.data.response.length > 0){
        //   setChatStart(true);
        //   setActiveIndex(0);
        //
        //   http.get(`/history/${response.data.response[0].chatRoomId}`)
        //   .then((response) => {
        //     setChatLoad(response.data.response);
        //   });
        // }
      })
    }catch(e){
      console.log(e);
    }
  },[]);

  return (
    <>
      <div className={`chat-bot${textSize === "작게" ? " large" : textSize === "보통" ? " small" : ""}`}>
        <ChatSidebar
          http={http}
          chatHistoryList={chatHistoryList}
          handleSidebarClose={handleSidebarClose}
          sidebarClose={sidebarClose}
          setChatHistoryList={setChatHistoryList}
          setChatStart={setChatStart}
          chatLoad={chatLoad}
          setChatLoad={setChatLoad}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          chatStart={chatStart}
          chatViewRef={chatViewRef}
        />

        <div
            className={`sidebar-backdrop${sidebarClose ? '' : ' open'}`}
            onClick={handleSidebarClose}
        />
        <div className="contents">
          <ChatBotHeader textSize={textSize} setTextSize={setTextSize} handleSidebarClose={handleSidebarClose} />

          <div className={`chat-box${chatStart ? " active" : ""}`}>
            <div className="inner" ref={chatViewRef}>
              {!chatStart ?
                <>
                  <div className="start-chat">필요한 규정 정보를 찾아드릴게요.</div>
                </>
                :
                <>
                  <div className="chat-view">
                    {chatLoad.map((item, idx) => {
                      if(item.type === "USER"){
                        return <SendBalloon sendMessage={item.content} key={`user-${idx}`} />
                      }else if(item.type === "ERROR") {
                        return <ErrorBalloon errorMessage={item.content} key={`error-${idx}`} />
                      }else{
                        return (
                          <div className="answer" key={`ans-${idx}`}>
                            {item.citations && item.citations.length > 0 ?
                              <>
                                {/* 텍스트 & 드롭다운 */}
                                <AnswerDropdown text={textParser(item.content)} accordionList={item.citations} />
                              </>
                              :
                              <>
                                {/* 순수 텍스트만 */}
                                <AnswerText text={textParser(item.content)} />
                              </>
                            }
                            {/* historySeq와 http 전달 */}
                            <LikesBtn http={http} historySeq={item.historySeq} />
                          </div>
                        )
                      }
                    })}

                    {/* 로딩 시 나오는 Progress Bar */}
                    {loading ?
                      <WaitProgressBar />
                      :
                      null
                    }
                  </div>
                </>
              }
            </div>
            <div className="chat-input-box">
              <Button icon={"plus"} />
              <label>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={"규정 및 지침에 대해 궁금하신 내용을 입력해주세요."}
                  value={chatInputVal}
                  onInput={handleChatInputChange}
                  onKeyDown={handleEnterSend}
                  disabled={loading}
                />
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
