import React, { useState } from "react";
import Button from "../Button.jsx";

const WaitProgressBar = () => {
  const [likeBtn, setLikeBtn] = useState(false);
  const [dislikeBtn, setDislikeBtn] = useState(false);

  /* like 버튼 클릭 */
  const likeClick = () => {
    setLikeBtn(true);
    setDislikeBtn(false);
  }

  /* dislike 버튼 클릭 */
  const dislikeClick = () => {
    setLikeBtn(false);
    setDislikeBtn(true);
  }

  return (
    <div className="rating btn-wrap">
      <Button className={`like${likeBtn ? " active" : ""}`} icon={"like"} onClick={likeClick} />
      <Button className={`dislike${dislikeBtn ? " active" : ""}`} icon={"dislike"} onClick={dislikeClick} />
    </div>
  )
}

export default WaitProgressBar;
