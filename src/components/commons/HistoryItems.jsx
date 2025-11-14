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

  const handleHistoryClick = (clickedIndex) => {
    props.setChatList((prevChatList) =>
      prevChatList.map((item, index) => ({
        ...item,
        active: index === clickedIndex,
      }))
    );
  }

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setMoreActive(true);
    setMoreOpen(!moreOpen);

    const rect = e.currentTarget.getBoundingClientRect();
    setMoreRect(rect);
  }

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
      props.setChatList((prevChatList) =>
        prevChatList.map((item, index) => ({
          ...item,
          title: index === clickedIndex ? rename : item.title,
        }))
      );

      setTitleChange(false);
    }
  }

  /* 더보기 > 삭제 클릭 */
  const handleDelete = (clickedIndex) => {
    props.setChatList((prevChatList) =>
      prevChatList.filter((item, index) => index !== clickedIndex)
    );

    setMoreOpen(false);
  }

  /* 열린 팝업 외부 클릭 시 닫기 */
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [moreOpen]);

  return (
    <>
      <li className={`btn${props.item.active ? " active" : ""}`} onClick={() => handleHistoryClick(props.index)}>
        {titleChange ?
          <>
            <label ref={titleChangerRef}>
              <input type="text" defaultValue={props.item.title} name={"title_change"} onInput={handleTitleInput} onKeyDown={(e) => handleKeyDown(e, props.index)} autoFocus={true}/>
            </label>
          </>
          :
          <>
            <p>{props.item.title}</p>
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
