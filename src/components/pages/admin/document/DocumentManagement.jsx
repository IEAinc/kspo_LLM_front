import React, {useMemo} from 'react';
import {API_ENDPOINT, http} from '../../../../assets/api/commons.js';
import AdminGridPage from '../../../commons/admin/AdminGridPage.jsx';
import Select from '../../../commons/admin/forms/Select.jsx';
import Input from '../../../commons/admin/forms/Input.jsx';
import CustomDatePicker from '../../../commons/admin/forms/CustomDatepicker.jsx';
import Btn from '../../../commons/admin/forms/Btn.jsx';
import {createDateFormatter, createNoColumnValueGetter} from '../../../../utils/adminUtils.js';

const docTypeOptions = [
  { value: '', label: '전체' },
  { value: 'BASE', label: '기본규정' },
  { value: 'GA', label: '총무' },
  { value: 'HRP', label: '인사' },
  { value: 'ACC', label: '회계' },
  { value: 'BIZ', label: '사업' },
  { value: 'ETC', label: '기타' },
];

const DocumentManagement = () => {
  const columns = useMemo(() => ([
    {
      headerName: 'NO',
      field: "number",
      cellClass: 'text-center',
      width: 70,
      suppressSizeToFit: true,
      valueGetter: createNoColumnValueGetter(),
    },
    { headerName: '문서유형', field: 'docTypeName', flex: 1, cellClass: 'text-center', width: 90},
    { headerName: '파일명', field: 'fileName', flex: 1, cellClass: 'text-left'},
    {
      headerName: '사용 여부',
      field: 'useYn',
      flex: 1,
      cellClass: 'text-center',
      width: 90,
      valueFormatter: (p) => (p.value === 'Y' ? '사용' : '미사용')
    },
    { headerName: '등록자', field: 'id', flex: 1, cellClass: 'text-center', width: 60},
    { headerName: '등록일', field: 'created', valueFormatter: createDateFormatter(), flex: 1, cellClass: 'text-center', width: 120},
    { headerName: '수정자', field: 'updatedId', flex: 1, cellClass: 'text-center', width: 60},
    { headerName: '수정일', field: 'updated', valueFormatter: createDateFormatter(), flex: 1, cellClass: 'text-center', width: 120},
    {
      headerName: "상세보기",
      field: 'regulationDocsSeq',
      width: 100,
      suppressSizeToFit: true,
      cellClass: 'flex-center',
      cellRenderer: (params) => (
        <Btn size="xxs" onClick={() => window.location.href = `/ksponcoadministrator/document/detail/${params.data.regulationDocsSeq}`}>
          상세보기
        </Btn>
      ),
    },
  ]), []);

  return (
    <AdminGridPage
      apiEndpoint={(params) => http.get(API_ENDPOINT.DOCS_PAGE, { params })}
      deleteEndpoint={(data) => http.delete(API_ENDPOINT.DOCS_DELETE, { data })}
      initialParams={{ page: 1, size: 10, docType: null, fileName: null, startDate: null, endDate: null }}
      rowMapper={(content) => content.map((it) => ({ id: it.regulationDocsSeq, ...it }))}
      columns={columns}
      gridOptions={{
        height: 463,
        indicator: { excel: true, edit: true, register: true, delete: true },
        resizable: true,
      }}
      renderSearchFields={(params, onParamsChange) => (
        <>
          <Select
            label="문서 유형"
            value={docTypeOptions.find((opt) => opt.value === params.docType) || docTypeOptions[0]}
            onChange={(opt) => onParamsChange({ docType: opt.value })}
            options={docTypeOptions}
            uiOptions={{ widthSize: 'md', labelSize: 'lg' }}
          />
          <Input
            labelName="파일명"
            type="text"
            value={params.fileName || ''}
            onChange={(e) => onParamsChange({ fileName: e.target.value })}
            options={{ widthSize: 'lg', labelSize: 'sm' }}
          />
          <CustomDatePicker
            options={{ widthSize: 'md', labelSize: 'sm' }}
            startDate={params.startDate}
            endDate={params.endDate}
            onStartDateChange={(startDate) => onParamsChange({ startDate })}
            onEndDateChange={(endDate) => onParamsChange({ endDate })}
          />
        </>
      )}
      onRegister={({ navigate }) => navigate('/ksponcoadministrator/document/register')}
      onEdit={(gridApi, row, { navigate, showAlert }) => {
        const id = row.regulationDocsSeq || row.id;
        if (!id) {
          showAlert({ title: '오류', message: '선택한 항목의 식별자를 찾을 수 없습니다.' });
          return;
        }
        navigate(`/ksponcoadministrator/document/update/${encodeURIComponent(String(id))}`);
      }}
      getDeleteIds={(row) => row.regulationDocsSeq ?? row.id}
      deleteIdField="regulationDocsSeqList"
    />
  );
};

export default DocumentManagement;
