import React, { useMemo, useState } from 'react';
import Box from './Box.jsx';
import Btn from '../../admin/forms/Btn.jsx';
import Input from '../../admin/forms/Input.jsx';
import Select from '../../admin/forms/Select.jsx';
import CustomDatePicker from "../forms/CustomDatepicker.jsx";

// Admin 전용 검색 박스 (Box, Btn, Input, Select 사용)
const AdminSearchBox = ({ defaultSearch, onSearch }) => {
  // 셀렉트 옵션 (문서 유형)
  const docTypeOptions = useMemo(() => ([
    { value: '', name: '전체', label: '전체' },
    { value: 'BASE', name: '기본규정', label: '기본규정' },
    { value: 'GA', name: '총무', label: '총무' },
    { value: 'HRP', name: '인사', label: '인사' },
    { value: 'ACC', name: '회계', label: '회계' },
    { value: 'BIZ', name: '사업', label: '사업' },
    { value: 'ETC', name: '기타', label: '기타' },
  ]), []);

  const defaultDocTypeValue = useMemo(() => {
    const found = docTypeOptions.find(o => o.value === (defaultSearch?.docType ?? ''));
    return found || docTypeOptions[0];
  }, [defaultSearch?.docType, docTypeOptions]);

  const [docType, setDocType] = useState(defaultDocTypeValue);
  const [fileName, setFileName] = useState(defaultSearch?.fileName || '');

  const parseDateString = (s) => {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  };
  const [startDate, setStartDate] = useState(parseDateString(defaultSearch?.startDate));
  const [endDate, setEndDate] = useState(parseDateString(defaultSearch?.endDate));

  const formatYmd = (d) => {
    if (!d) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const submit = (e) => {
    e?.preventDefault?.();
    onSearch?.({
      page: 0,
      size: 10,
      docType: (docType?.value ?? '') || null,
      fileName: (fileName ?? '') || null,
      startDate: formatYmd(startDate),
      endDate: formatYmd(endDate),
    });
  };

  const reset = () => {
    const init = docTypeOptions[0]; // 전체
    setDocType(init);
    setFileName('');
    setStartDate(null);
    setEndDate(null);
    onSearch?.({ page: 0, size: 10, docType: null, fileName: null, startDate: null, endDate: null });
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
              label="문서 유형"
              value={docType}
              onChange={setDocType}
              options={docTypeOptions}
              uiOptions={{ widthSize: 'md', labelSize: 'lg' }}
            />

            <Input
              labelName="파일명"
              type="text"
              name="fileName"
              placeholder="파일명을 입력하세요"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              options={{ isNormal: true, widthSize: 'lg', labelSize: 'sm' }}
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

export default AdminSearchBox;
