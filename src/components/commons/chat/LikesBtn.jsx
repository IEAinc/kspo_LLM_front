import React, { useState } from "react";
import Button from "../Button.jsx";

const LikesBtn = ({ http, historySeq }) => {
  const [likeBtn, setLikeBtn] = useState(false);
  const [dislikeBtn, setDislikeBtn] = useState(false);

  const handleResponse = (resData) => {
    console.log(resData);
    if(resData === "THUMBS_UP"){
      setLikeBtn(true);
      setDislikeBtn(false);
    }else if(resData === "THUMBS_DOWN"){
      setLikeBtn(false);
      setDislikeBtn(true);
    }else if(resData === "DELETE"){
      setLikeBtn(false);
      setDislikeBtn(false);
    }
  }

  const likeClick = async () => {
    if(!http || historySeq === undefined || historySeq === null) return;

    try{
        const payload = { historySeq, point: 5, comment: "" };
        const res = await http.post("/evaluation", payload);
        handleResponse(res.data.response);
    }catch(e){
      console.error(e);
    }
  }

  const dislikeClick = async () => {
    if(!http || historySeq === undefined || historySeq === null) return;

    try{
        const payload = { historySeq, point: 0, comment: "" };
        const res = await http.post("/evaluation", payload);
        handleResponse(res.data.response);
    }catch(e){
      console.error(e);
    }
  }

  return (
    <div className="rating btn-wrap">
      <Button className={`like${likeBtn ? " active" : ""}`} icon={"like"} onClick={() => likeClick()} />
      <Button className={`dislike${dislikeBtn ? " active" : ""}`} icon={"dislike"} onClick={() => dislikeClick()} />
    </div>
  )
}

export default LikesBtn;
