import React, { useState } from "react";
import AccordionBox from "../AccordionBox.jsx";

const AnswerText = (props) => {

  return (
    <div className="dropdown-answer">
      <div className="answer">{props.text}</div>
      <AccordionBox accordionList={props.accordionList} />
    </div>
  )
}

export default AnswerText;
