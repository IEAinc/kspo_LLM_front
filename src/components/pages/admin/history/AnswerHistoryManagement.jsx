import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINT, http } from '../../../../assets/api/commons.js';
import CustomAlert from '../../../commons/admin/CustomAlert.jsx';
import Box from '../../../commons/admin/boxs/Box.jsx';
import AgGrid from '../../../commons/admin/grids/AgGrid.jsx';
import AnswerHistorySearchBox from '../../../commons/admin/boxs/AnswerHistorySearchBox.jsx';
import Btn from '../../../commons/admin/forms/Btn.jsx';

const AnswerHistoryManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Alert 상태
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    type: 'info',
    message: '',
    iconMode: 'warn',
    confirmButton: false,
    cancelButton: false,
    onConfirm: undefined,
    onCancel: undefined,
  });
  const hideAlert = () => setAlertState((prev) => ({ ...prev, isOpen: false }));

  // Grid 상태
  const [gridData, setGridData] = useState([]);
  const [pageData, setPageData] = useState({});
  const [gridColumns, setGridColumns] = useState([]);
  const [searchParams, setSearchParams] = useState({ page: 1, size: 10, evaluationType: null, queryText: null, startDate: null, endDate: null });

  const dateFormatter = (params) => {
    if (!params.value) return '';
    const date = new Date(params.value);
    if (isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleRowClick = (chatGroupSeq) => {
    const basePath = location.pathname;
    navigate(`${basePath}/detail/${String(chatGroupSeq)}`);
  };

  // 컬럼 정의 (체크박스 없음)
  useEffect(() => {
    setGridColumns([
      { headerName: '날짜', field: 'lastCreated', valueFormatter: (p) => dateFormatter(p), flex: 1, cellClass: 'text-center', width: 120 },
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
          <Btn size="xxs" onClick={() => handleRowClick(params.data.chatGroupSeq)}>
            상세보기
          </Btn>
        ),
      },
    ]);
  }, []);

  // 데이터 조회
  const fetchHistories = async (criteria) => {
    const params = { ...(criteria || searchParams) };
    setSearchParams(params);
    try {
      const res = await http.get(API_ENDPOINT.ANSWER_HISTORY, {
        params: {
          page: params.page ?? 1,
          size: params.size ?? 10,
          evaluationType: params.evaluationType || undefined,
          queryText: params.queryText || undefined,
          startDate: params.startDate || undefined,
          endDate: params.endDate || undefined,
        },
      });

      const body = res?.data?.response || {};
      const content = Array.isArray(body?.content) ? body.content : [];
      const mapped = content.map((it) => ({
        id: it.chatGroupSeq,
        source: it.source || '-',
        ...it,
        evaluation: it.evaluation === '미응답' ? '미응답' : it.evaluation,
      }));
      setGridData(mapped);
      setPageData({
        totalElements: body.totalElements || 0,
        currentPage: (body.page || 0),
        pageSize: body.size || 10,
      });
    } catch (e) {
      setAlertState({
        isOpen: true,
        title: '오류',
        message: '이력 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        iconMode: 'warn',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: () => setAlertState((p) => ({ ...p, isOpen: false })),
      });
    }
  };

  // 최초 로드 시 목록 조회
  useEffect(() => {
    fetchHistories(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div>
      <div className="w-full mb-[16px]">
        <AnswerHistorySearchBox defaultSearch={searchParams} onSearch={fetchHistories} />
      </div>
      <Box>
        <AgGrid
          rowDeselection={true}
          rowData={gridData}
          pageData={pageData}
          columnDefs={gridColumns}
          height={463}
          indicator={{ excel: true }}
          isCheckboxMode={false}
          sortable={true}
          onPageChange={(page) => fetchHistories({ ...searchParams, page })}
          onPageSizeChange={(size) => fetchHistories({ ...searchParams, page: 1, size })}
        />
      </Box>
      <CustomAlert
        title={alertState.title}
        iconMode={alertState.iconMode}
        message={alertState.message}
        onClose={hideAlert}
        isOpen={alertState.isOpen}
        confirmButton={alertState.confirmButton}
        cancelButton={alertState.cancelButton}
        onConfirm={alertState.onConfirm}
        onCancel={alertState.onCancel}
      />
    </div>
  );
};

export default AnswerHistoryManagement;