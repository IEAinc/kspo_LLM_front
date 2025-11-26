import React, { useState } from "react";
import AccordionBox from "../AccordionBox.jsx";

const AnswerText = (props) => {

    /**
     * Markdown 텍스트 파서
     * 각 수평선을 기준으로 <div></div><hr/><div></div> 형태로 변환
     * --- : 수평선
     * **텍스트** : 굵은 글씨
     * \n : 줄바꿈
     */
    function textParser(text){
        const lines = text.split('\n');
        const elements = [];
        let currentLines = [];
        let keyCounter = 0;

        const parseLineToSpan = (line) => {
            const boldRegex = /\*\*(.*?)\*\*/g;
            const parts = [];
            let lastIndex = 0;
            let match;
            while ((match = boldRegex.exec(line)) !== null) {
                if (match.index > lastIndex) {
                    parts.push(line.substring(lastIndex, match.index));
                }
                parts.push(<strong key={`b-${keyCounter++}`}>{match[1]}</strong>);
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < line.length) {
                parts.push(line.substring(lastIndex));
            }
            return <span key={`s-${keyCounter++}`}>{parts}<br/></span>;
        };

        lines.forEach((line) => {
            if (line.trim() === '---') {
                elements.push(<div key={`div-${keyCounter++}`}>{currentLines.map(parseLineToSpan)}</div>);
                elements.push(<hr key={`hr-${keyCounter++}`}/>);
                currentLines = [];
            } else {
                currentLines.push(line);
            }
        });

        elements.push(<div key={`div-${keyCounter++}`}>{currentLines.map(parseLineToSpan)}</div>);

        return elements;
    }

  return (
    <div className="dropdown-answer">
      <p>{textParser(props.text)}</p>
      <AccordionBox accordionList={props.accordionList} />
    </div>
  )
}

export default AnswerText;
