import React from "react";

const InputBox = (props) => {

  return (
    <div className="input-box">
      <label className={props.validation ? "fail" : ""}>
        <input
          type={props.password ? "password" : "text"}
          name={props.name}
          value={props.value}
          readOnly={props.readOnly}
          disabled={props.disabled}
          placeholder={props.placeholder}
          onInput={props.onInput}
          onKeyDown={props.onKeyDown}
        />
      </label>
      <span className="error">{props.validation}</span>
    </div>
  )
}

export default InputBox;
