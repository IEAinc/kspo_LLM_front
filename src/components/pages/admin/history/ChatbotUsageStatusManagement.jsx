import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { API_ENDPOINT, http } from '../../../../assets/api/commons.js';
import CustomAlert from '../../../commons/admin/CustomAlert.jsx';
import Box from '../../../commons/admin/boxs/Box.jsx';
import AgGrid from '../../../commons/admin/grids/AgGrid.jsx';
import UsageSearchBox from '../../../commons/admin/boxs/UsageSearchBox.jsx';

const ChatbotUsageStatusManagement = () => {
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
  const [searchParams, setSearchParams] = useState({ page: 1, size: 10, startDate: null, endDate: null });

  const dateFormatter = (params) => {
    if (!params.value) return '';
    const d = new Date(params.value);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // 컬럼 정의 (체크박스 없음)
  useEffect(() => {
    setGridColumns([
      { headerName: 'NO', field: 'number', cellClass: 'text-center', suppressSizeToFit: true,
        valueGetter: (params) => {
          try {
            const rowIndex = params.node.rowIndex;
            const { currentPage = 1, pageSize = 10 } = params?.context || {};
            const base = (currentPage - 1) * pageSize;
            return base + rowIndex + 1;
          } catch {
            return params.node.rowIndex + 1;
          }
        },
      },
      { headerName: '날짜', field: 'date', valueFormatter: (p) => dateFormatter(p), flex: 1, cellClass: 'text-center'},
      { headerName: '이용자 수', field: 'usageCount', flex: 1, cellClass: 'text-center'},
      { headerName: '질문 횟수', field: 'questionCount', flex: 1, cellClass: 'text-center'},
      { headerName: '만족도 현황', field: 'satisfactionSummary', flex: 2, cellClass: 'text-center',},
    ]);
  }, []);

  // 데이터 조회
  const fetchUsage = async (criteria) => {
    const params = { ...(criteria || searchParams) };
    setSearchParams(params);
    try {
      const res = await http.get(API_ENDPOINT.HISTORY_USAGE, {
        params: {
          page: params.page ?? 1,
          size: params.size ?? 10,
          startDate: params.startDate || undefined,
          endDate: params.endDate || undefined,
        },
      });

      const body = res?.data?.response || {};
      const content = Array.isArray(body?.content) ? body.content : [];
      const mapped = content.map((it, idx) => {
        const thumbsUp = it.thumbsUpCount ?? 0;
        const thumbsDown = it.thumbsDownCount ?? 0;
        const noResp = it.noResponseCount ?? 0;
        const satisfactionSummary = `만족 ${thumbsUp}건/불만족 ${thumbsDown}건/무응답 ${noResp}건`;
        return {
          id: `${it.date ?? ''}-${idx}`,
          satisfactionSummary,
          ...it,
        };
      });
      setGridData(mapped);
      setPageData({
        totalElements: body.totalElements || 0,
        currentPage: (body.page || 0) + 1,
        pageSize: body.size || 10,
      });
    } catch (e) {
      setAlertState({
        isOpen: true,
        title: '오류',
        message: '사용 현황을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        iconMode: 'warn',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: () => setAlertState((p) => ({ ...p, isOpen: false })),
      });
    }
  };

  // 최초 로드 시 목록 조회
  useEffect(() => {
    fetchUsage(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div>
      <div className="w-full mb-[16px]">
        <UsageSearchBox defaultSearch={searchParams} onSearch={fetchUsage} />
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

export default ChatbotUsageStatusManagement;