import React from "react";
import Button from "./Button.jsx";

const AlertBox = (props) => {

  const handleClose = () => {
    props.setStatus(false);
  }

  return (
    <div className={`dimmed${props.status ? " active" : ""}`}>
      <div className="alert-box">
        {/* mark type = warning, question, success */}
        <div className={`alert-mark${props.type ? ` ${props.type}` : ""}`}></div>
        <h3>{props.text}</h3>
        <p>{props.subText}</p>
        <div className="btn-wrap center">
          {props.confirm ?
            <>
              <Button className={"outline"} text={"취소"} contained onClick={handleClose} />
            </>
            :
            null
          }
          <Button className={"primary"} text={"확인"} contained onClick={handleClose} />
        </div>
      </div>
    </div>
  )
}

export default AlertBox;
