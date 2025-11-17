import React from "react";
import AccordionBox from "../AccordionBox.jsx";

const AnswerText = (props) => {

  return (
    <div className="dropdown-answer">
      <p>{props.text}</p>
      <AccordionBox accordionList={props.accordionList} setAccordionList={props.setAccordionList} />
    </div>
  )
}

export default AnswerText;
