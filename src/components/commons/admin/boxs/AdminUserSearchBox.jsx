import React, { useState } from 'react';
import Box from './Box.jsx';
import Btn from '../../admin/forms/Btn.jsx';
import Input from '../../admin/forms/Input.jsx';
import CustomDatePicker from "../forms/CustomDatepicker.jsx";

// Admin 사용자 전용 검색 박스 (기간 + 성함/아이디)
const AdminUserSearchBox = ({ defaultSearch, onSearch }) => {
  const [keyword, setKeyword] = useState(defaultSearch?.keyword || '');

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
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const submit = (e) => {
    e?.preventDefault?.();
    const nameOrId = (keyword ?? '').trim() || null;
    onSearch?.({
      page: 0,
      size: 10,
      // 서버에서 name/id 둘 중 하나라도 매칭되도록 같은 키워드 전송
      name: nameOrId,
      id: nameOrId,
      startDate: formatYmd(startDate),
      endDate: formatYmd(endDate),
    });
  };

  const reset = () => {
    setKeyword('');
    setStartDate(null);
    setEndDate(null);
    onSearch?.({ page: 0, size: 10, name: null, id: null, startDate: null, endDate: null });
  };

  return (
    <Box padding={{ px: 16, py: 16 }}>
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-1 lg:items-start">
          <div className="flex flex-wrap items-center gap-[20px] md:flex-row lg:flex-1 lg:flex-row lg:gap-[40px] lg:mt-[0]">
            <Input
              labelName="성함/아이디"
              type="text"
              name="keyword"
              placeholder="성함 또는 아이디를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              options={{ widthSize: 'lg', labelSize: 'lg' }}
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

export default AdminUserSearchBox;
