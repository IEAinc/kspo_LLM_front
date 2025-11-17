import React from "react";

const Button = (props) => {
  document.querySelectorAll('.btn[data-size]').forEach(item => {
    const size = item.getAttribute('data-size');
    if(size){
      item.style.setProperty("--icon-size", `${size}px`);
    }
  });

  return (
    <button
      type={props.type ? props.type : "button"}
      className={`btn${props.className ? ` ${props.className}` : ""}${props.icon ? " icon" : ""}${props.contained ? " contained" : ""}${props.noPadding ? " no-padding" : ""}`}
      data-size={props.iconSize}
      onClick={props.onClick}
      disabled={props.disabled}
      style={{ "--icon-size": props.iconSize ? `${props.iconSize}px` : null }}
    >
      {props.icon && <span className={`btn-icon ${props.icon}`}></span>}
      {props.text && <span className="btn-text">{props.text}</span>}
    </button>
  )
}

export default Button;
