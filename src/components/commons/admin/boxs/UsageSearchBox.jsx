import React, { useState } from 'react';
import Box from './Box.jsx';
import Btn from '../../admin/forms/Btn.jsx';
import CustomDatePicker from "../forms/CustomDatepicker.jsx";

// 기간만 있는 검색 박스 (사용 현황 전용)
const UsageSearchBox = ({ defaultSearch, onSearch }) => {
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
    onSearch?.({
      page: 0,
      size: 10,
      startDate: formatYmd(startDate),
      endDate: formatYmd(endDate),
    });
  };

  const reset = () => {
    setStartDate(null);
    setEndDate(null);
    onSearch?.({ page: 0, size: 10, startDate: null, endDate: null });
  };

  return (
    <Box padding={{ px: 16, py: 16 }}>
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-1 lg:items-start w-full">
          <div className="flex flex-wrap items-center gap-[20px] md:flex-row lg:flex-1 lg:flex-row lg:gap-[40px] lg:mt-[0] w-full">
            <CustomDatePicker
              options={{ widthSize: 'md', labelSize: 'sm' }}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-end gap-[8px] mt-[10px] lg:w-auto lg:mt-[0] lg:justify-end">
          <Btn size="sm" minWidth={"95px"} iconMode="reset" onClick={reset}>초기화</Btn>
          <Btn type="submit" minWidth={"65px"} size="sm" onClick={submit}>검색</Btn>
        </div>
      </div>
    </Box>
  );
};

export default UsageSearchBox;
