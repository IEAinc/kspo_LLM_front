import React, { useMemo, useState } from 'react';
import Box from './Box.jsx';
import Btn from '../../admin/forms/Btn.jsx';
import Input from '../../admin/forms/Input.jsx';
import Select from '../../admin/forms/Select.jsx';
import CustomDatePicker from "../forms/CustomDatepicker.jsx";

const AnswerHistorySearchBox = ({ defaultSearch, onSearch }) => {
  // 만족도 옵션
  const evaluationOptions = useMemo(() => ([
    { value: '', label: '전체', name: '전체' },
    { value: 'THUMBS_UP', label: '좋아요', name: '좋아요' },
    { value: 'THUMBS_DOWN', label: '싫어요', name: '싫어요' },
    // 서버는 "미응답" 값을 사용하므로 value는 미응답, 라벨은 무응답
    { value: 'NO_RESPONSE', label: '무응답', name: '무응답' },
  ]), []);

  const defaultEvalValue = useMemo(() => {
    const found = evaluationOptions.find(o => o.value === (defaultSearch?.evaluationType ?? ''));
    return found || evaluationOptions[0];
  }, [defaultSearch?.evaluationType, evaluationOptions]);

  const [evaluationType, setEvaluationType] = useState(defaultEvalValue);
  const [keyword, setKeyword] = useState(defaultSearch?.queryText || '');

  const parseDateString = (s) => {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  };
  const [startDate, setStartDate] = useState(parseDateString(defaultSearch?.startDate));
  const [endDate, setEndDate] = useState(parseDateString(defaultSearch?.endDate));

  const formatYmd = (d) => {
    if (!d) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  const submit = (e) => {
    e?.preventDefault?.();
    onSearch?.({
      page: 0,
      size: 10,
      evaluationType: (evaluationType?.value ?? '') || null,
      queryText: (keyword ?? '') || null,
      startDate: formatYmd(startDate),
      endDate: formatYmd(endDate),
    });
  };

  const reset = () => {
    const init = evaluationOptions[0];
    setEvaluationType(init);
    setKeyword('');
    setStartDate(null);
    setEndDate(null);
    onSearch?.({ page: 0, size: 10, evaluationType: null, queryText: null, startDate: null, endDate: null });
  };

  return (
    <Box padding={{ px: 16, py: 16 }}>
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-1 lg:items-start">
          <div className="flex flex-wrap items-center gap-[20px] md:flex-row lg:flex-1 lg:flex-row lg:gap-[40px] lg:mt-[0]">
            <CustomDatePicker
              options={{ widthSize: 'md', labelSize: 'sm' }}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />

            <Select
              label="만족도"
              value={evaluationType}
              onChange={setEvaluationType}
              options={evaluationOptions}
              uiOptions={{ widthSize: 'md', labelSize: 'md' }}
            />

            <Input
              labelName="사용자 질문/답변 키워드"
              type="text"
              name="queryText"
              placeholder="키워드를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              options={{ widthSize: 'lg', labelSize: 'lg', marginSize: 'md' }}
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-end gap-[8px] mt-[10px] lg:w-auto lg:mt-[0] lg:justify-end">
          <Btn size="sm" minWidth="86px" iconMode="reset" onClick={reset}>초기화</Btn>
          <Btn type="submit" size="sm" onClick={submit}>검색</Btn>
        </div>
      </div>
    </Box>
  );
};

export default AnswerHistorySearchBox;
