import React, { useEffect, useRef, useState } from "react";
import Button from "./Button.jsx";

const HistoryItems = (props) => {
  const [moreActive, setMoreActive] = useState(false);
  const [moreRect, setMoreRect] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const editMenuRef = useRef(null);

  const [titleChange, setTitleChange] = useState(false);
  const [rename, setRename] = useState("");
  const titleChangerRef = useRef(null);

  /* 히스토리 목록 클릭 시 기존 메시지 로딩 */
  const handleHistoryClick = (clickedIndex) => {
    props.setActiveIndex(clickedIndex);

    props.http.get(`/history/${props.item.chatRoomId}`)
    .then((response) => {
      props.setChatLoad(response.data.response);
      props.setChatStart(true);
    });
  }

  /* 더보기 버튼 클릭 */
  const handleMoreClick = (e) => {
    e.stopPropagation();
    setMoreActive(true);
    setMoreOpen(!moreOpen);

    const rect = e.currentTarget.getBoundingClientRect();
    setMoreRect(rect);
  }

  /* 더보기 외부 클릭 시 닫기 */
  const handleClickOutside = (e) => {
    if(editMenuRef.current && editMenuRef.current.contains(e.target) || titleChangerRef.current && titleChangerRef.current.contains(e.target)){
      return;
    }

    /* 더보기 메뉴 열었을 때 */
    if(moreOpen){
      setMoreOpen(false);
    }

    /* 더보기 > 수정 눌렀을 때 */
    if(titleChange){
      setTitleChange(false);
    }

    setMoreActive(false);
  };

  /* 더보기 > 수정 클릭 */
  const handleTitleChange = () => {
    setTitleChange(true);
    setMoreOpen(false);
  }

  /* 수정 값 실시간 반영 */
  const handleTitleInput = (e) => {
    setRename(e.target.value);
  }

  /* 수정 하고 엔터 누를 때 적용 */
  const handleKeyDown = (e, clickedIndex) => {
    if(e.keyCode === 13){
      props.setChatHistoryList((prevChatList) =>
        prevChatList.map((item, index) => ({
          ...item,
          chatRoomName: index === clickedIndex ? rename : item.chatRoomName,
        }))
      );

      try{
        props.http.put(`/room`, {
          roomId: props.item.chatRoomId,
          roomName: rename
          })
        .then(() => {
        })
      }catch(e){
        console.log(e)
      }

      setTitleChange(false);
    }
  }

  /* 더보기 > 삭제 클릭 */
  const handleDelete = () => {
    try{
      props.http.delete(`/room/${props.item.chatRoomId}`)
      .then(() => {
        props.setChatLoad([]);
        props.setChatStart(false);
        props.setActiveIndex(null);
      })
    }catch(e){
      console.log(e)
    }

    setMoreOpen(false);
  }

  /* 열린 팝업 외부 클릭 시 닫기 */
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [moreOpen]);

  return (
    <>
      <li className={`btn${props.activeIndex === props.index ? " active" : ""}`} onClick={() => handleHistoryClick(props.index)}>
        {titleChange ?
          <>
            <label ref={titleChangerRef}>
              <input type="text" defaultValue={props.item.chatRoomName} name={"title_change"} onInput={handleTitleInput} onKeyDown={(e) => handleKeyDown(e, props.index)} autoFocus={true}/>
            </label>
          </>
          :
          <>
            <p>{props.item.chatRoomName}</p>
          </>
        }
        <Button className={moreActive ? "active" : ""} icon={"more"} noPadding onClick={handleMoreClick} />

        <div
          ref={editMenuRef}
          className={`edit-menu${moreOpen ? " active" : ""}`}
          style={{ left: `${moreRect ? moreRect.left : 0}px`, top: `${moreRect ? moreRect.bottom : 0}px` }}
        >
          <Button icon={"edit"} text={"이름변경"} contained onClick={() => handleTitleChange(props.index)} />
          <Button icon={"remove"} text={"삭제"} contained onClick={() => handleDelete(props.index)} />
        </div>
      </li>
    </>
  )
}

export default HistoryItems;
