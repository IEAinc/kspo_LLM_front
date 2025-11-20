import React, { useState } from 'react';

// Admin 전용 간단 검색 박스 (Tailwind 사용)
// props: defaultSearch { docType, fileName, startDate, endDate }, onSearch(criteria)
const AdminSearchBox = ({ defaultSearch, onSearch }) => {
  const [docType, setDocType] = useState(defaultSearch?.docType || '');
  const [fileName, setFileName] = useState(defaultSearch?.fileName || '');
  const [startDate, setStartDate] = useState(defaultSearch?.startDate || '');
  const [endDate, setEndDate] = useState(defaultSearch?.endDate || '');

  const submit = (e) => {
    e?.preventDefault?.();
    onSearch?.({
      page: 0,
      size: 10,
      docType: docType || null,
      fileName: fileName || null,
      startDate: startDate || null,
      endDate: endDate || null,
    });
  };
  const reset = () => {
    setDocType('');
    setFileName('');
    setStartDate('');
    setEndDate('');
    onSearch?.({ page: 0, size: 10, docType: null, fileName: null, startDate: null, endDate: null });
  };

  return (
    <form onSubmit={submit} className="w-full rounded-[8px] border border-br-gray3 bg-white p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="flex flex-col">
          <label className="text-[14px] text-gray mb-1">문서 유형 (docType)</label>
          <input
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            placeholder="예: BASE"
            className="border border-br-gray rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[14px] text-gray mb-1">파일명</label>
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="파일명을 입력하세요"
            className="border border-br-gray rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[14px] text-gray mb-1">시작일</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-br-gray rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[14px] text-gray mb-1">종료일</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-br-gray rounded px-3 py-2"
          />
        </div>
      </div>
      <div className="mt-3 flex gap-2 justify-end">
        <button type="button" onClick={reset} className="px-3 py-2 rounded border border-br-gray text-[14px]">
          초기화
        </button>
        <button type="submit" className="px-3 py-2 rounded bg-primary-color text-white text-[14px]">
          검색
        </button>
      </div>
    </form>
  );
};

export default AdminSearchBox;
