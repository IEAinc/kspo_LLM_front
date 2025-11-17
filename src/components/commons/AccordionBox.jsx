import React, { useRef, useState } from "react";

const AccordionBox = (props) => {
  const contentRefs = useRef([]);

  const handleAccordionClick = (clickedIndex) => {
    props.setAccordionList(prevList => {
      return prevList.map((item, index) => {
        return {
          ...item,
          open: index === clickedIndex ? !item.open : item.open
        }
      })
    })
  }

  return (
    <>
      <div className="accordion-box">
        {props.accordionList.map((item, index) => {
          const contentEl = contentRefs.current[index];
          const contentHeight = contentEl ? contentEl.scrollHeight : 0;

          return (
            <div className="item" key={index} style={{height: item.open ? contentHeight + 52 : null}}>
              <button className="btn" onClick={() => {handleAccordionClick(index)}}>{item.title} <span>{item.subTitle}</span></button>
              <div className="content" ref={(elements) => {contentRefs.current[index] = elements}}>{item.content}</div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default AccordionBox;
