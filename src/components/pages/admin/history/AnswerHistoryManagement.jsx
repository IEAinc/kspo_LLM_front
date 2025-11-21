import React, { useMemo } from 'react';
import { API_ENDPOINT, http } from '../../../../assets/api/commons.js';
import AdminGridPage from '../../../commons/admin/AdminGridPage.jsx';
import Btn from '../../../commons/admin/forms/Btn.jsx';
import Select from '../../../commons/admin/forms/Select.jsx';
import Input from '../../../commons/admin/forms/Input.jsx';
import CustomDatePicker from '../../../commons/admin/forms/CustomDatepicker.jsx';
import { createDateFormatter } from '../../../../utils/adminUtils.js';

const evaluationOptions = [
  { value: '', label: '전체' },
  { value: 'THUMBS_UP', label: '좋아요' },
  { value: 'THUMBS_DOWN', label: '싫어요' },
  { value: 'NO_RESPONSE', label: '무응답' },
];

const AnswerHistoryManagement = () => {
  const columns = useMemo(() => ([
    { headerName: '날짜', field: 'lastCreated', valueFormatter: createDateFormatter(), flex: 1, cellClass: 'text-center', width: 120 },
    { headerName: '사용자질문', field: 'question', flex: 2, cellClass: 'text-left', minWidth: 180 },
    { headerName: '출처', field: 'source', flex: 1, cellClass: 'text-center', width: 120 },
    { headerName: '답변내용', field: 'answer', flex: 3, cellClass: 'text-left', minWidth: 220 },
    { headerName: '만족도', field: 'evaluation', flex: 1, cellClass: 'text-center', width: 100, valueFormatter: (p) => (p.value === '미응답' ? '무응답' : p.value) },
    { headerName: 'IP', field: 'ip', flex: 1, cellClass: 'text-center', width: 140 },
    {
      headerName: '상세보기',
      field: 'chatGroupSeq',
      width: 100,
      suppressSizeToFit: true,
      cellClass: 'flex-center',
      cellRenderer: (params) => (
        <Btn size="xxs" onClick={() => window.location.href = `/ksponcoadministrator/history/userQueryAnswerHistory/detail/${params.data.chatGroupSeq}`}>
          상세보기
        </Btn>
      ),
    },
  ]), []);

  return (
    <AdminGridPage
      apiEndpoint={(params) => http.get(API_ENDPOINT.ANSWER_HISTORY, { params })}
      initialParams={{ page: 1, size: 10, evaluationType: null, queryText: null, startDate: null, endDate: null }}
      rowMapper={(content) => content.map((it) => ({ ...it, id: it.chatGroupSeq, source: it.source || '-' }))}
      columns={columns}
      gridOptions={{
        height: 463,
        indicator: { excel: true },
        isCheckboxMode: false,
      }}
      renderSearchFields={(params, onParamsChange) => (
        <>
          <CustomDatePicker
            options={{ widthSize: 'md', labelSize: 'sm' }}
            startDate={params.startDate}
            endDate={params.endDate}
            onStartDateChange={(startDate) => onParamsChange({ startDate })}
            onEndDateChange={(endDate) => onParamsChange({ endDate })}
          />
          <Select
            label="만족도"
            value={evaluationOptions.find((opt) => opt.value === params.evaluationType) || evaluationOptions[0]}
            onChange={(opt) => onParamsChange({ evaluationType: opt.value })}
            options={evaluationOptions}
            uiOptions={{ widthSize: 'md', labelSize: 'md' }}
          />
          <Input
            labelName="사용자 질문/답변 키워드"
            value={params.queryText || ''}
            onChange={(e) => onParamsChange({ queryText: e.target.value })}
            options={{ widthSize: 'lg', labelSize: 'lg', marginSize: 'md' }}
          />
        </>
      )}
    />
  );
};

export default AnswerHistoryManagement;
