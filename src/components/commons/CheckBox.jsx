import React from "react";

const CheckBox = (props) => {

  return (
    <div className="check-box">
      <label>
        <input
          type={props.radio ? "radio" : "checkbox"}
          name={props.name}
          readOnly={props.readOnly}
          disabled={props.disabled}
        />
        <span>{props.text}</span>
      </label>
    </div>
  )
}

export default CheckBox;
