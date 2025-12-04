import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '../../../commons/admin/boxs/Box.jsx';
import Btn from '../../../commons/admin/forms/Btn.jsx';
import {API_ENDPOINT, http} from '../../../../assets/api/commons.js';

/**
 * Markdown 텍스트 파서
 * 각 수평선을 기준으로 <div></div><hr/><div></div> 형태로 변환
 * --- : 수평선
 * **텍스트** : 굵은 글씨
 * \n : 줄바꿈
 */
const textParser = (text) => {
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
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  });

  elements.push(<div key={`div-${keyCounter++}`}>{currentLines.map(parseLineToSpan)}</div>);

  return elements;
}

const AnswerDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [ip, setIp] = useState('');
  const [lastCreated, setLastCreated] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await http.get(`${API_ENDPOINT.ANSWER_HISTORY}/${encodeURIComponent(id)}`);
        const data = res?.data?.response || res?.data || {};
        setQuestion(data.question || '');
        setAnswer(data.answer || '');
        setEvaluation(data.evaluation || '');
        setIp(data.ip || '');
        setLastCreated(data.lastCreated || '');
      } catch (e) {
        // eslint-disable-next-line no-alert
        alert('상세 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const goList = () => navigate('/ksponcoadministrator/history/userQueryAnswerHistory');

  return (
    <div>
      <Box padding={{ px: 16, py: 16 }}>
        {/* 폼 테이블 */}
        <div className="border border-tb-br-color rounded-[4px] overflow-hidden">

          {/* 사용자 질문 */}
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              사용자 질문
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full">
                {question}
              </div>
            </div>
          </div>

          {/* 답변 내용 */}
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              답변내용
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full">
                {textParser(answer)}
              </div>
            </div>
          </div>

          {/* 만족도 평가 */}
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              만족도 평가
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full">
                {evaluation}
              </div>
            </div>
          </div>

          {/* 최종 수정자 / 최종 수정일시 */}
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              등록 IP
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                {ip}
              </div>
            </div>
          </div>
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              질문 일시
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                {lastCreated}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼: 상세에선 목록/수정, 수정 화면에선 목록만 */}
        <div className="mt-[16px] flex items-center justify-end gap-2">
          <Btn size="sm" onClick={goList}>목록</Btn>
        </div>
      </Box>
    </div>
  );
};

export default AnswerDetail;
