import React, { useRef, useState } from "react";
/**
 * @property {string} article
 * @property {string} chapter
 * @property {string} clause
 */

const AccordionBox = (props) => {
  const [openIndex, setOpenIndex] = useState(new Set());
  const contentRefs = useRef([]);

  // 아코디언 열고 닫기
  const handleAccordionClick = (clickedIndex) => {
    setOpenIndex((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(clickedIndex)) {
        newSet.delete(clickedIndex);
      } else {
        newSet.add(clickedIndex);
      }
      return newSet;
    });
  }

  return (
    <>
      <div className="accordion-box">
        {props.accordionList.map((item, index) => {
          const contentEl = contentRefs.current[index];
          const contentHeight = contentEl ? contentEl.scrollHeight : 0;
          const openChk = openIndex.has(index);

          return (
            <div className="item" key={index} style={{height: openChk ? contentHeight + 52 : null}}>
              <button className="btn" onClick={() => {handleAccordionClick(index)}}>{item.source} <span>{item.article} {item.chapter} {item.clause}</span></button>
              <div className="content" ref={(elements) => {contentRefs.current[index] = elements}}>{item.content}</div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default AccordionBox;
