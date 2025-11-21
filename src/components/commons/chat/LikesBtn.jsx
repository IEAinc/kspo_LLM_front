import React, { useState } from "react";
import Button from "../Button.jsx";
import {API_ENDPOINT} from "../../../assets/api/commons.js";

const LikesBtn = ({ http, historySeq }) => {
  const [likeBtn, setLikeBtn] = useState(false);
  const [dislikeBtn, setDislikeBtn] = useState(false);

  const handleResponse = (resData) => {
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

  const LIKE_POINT = {
    LIKE: 5,
    DISLIKE: 0
  }

  const likeClick = async (point) => {
    if(!http || historySeq === undefined || historySeq === null) return;

    try{
        const payload = { historySeq, point: point, comment: "" };
        const res = await http.post(API_ENDPOINT.LIKE, payload);
        handleResponse(res.data.response);
    }catch(e){
      console.error(e);
    }
  }

  return (
    <div className="rating btn-wrap">
      <Button className={`like${likeBtn ? " active" : ""}`} icon={"like"} onClick={() => likeClick(LIKE_POINT.LIKE)} />
      <Button className={`dislike${dislikeBtn ? " active" : ""}`} icon={"dislike"} onClick={() => likeClick(LIKE_POINT.DISLIKE)} />
    </div>
  )
}

export default LikesBtn;
