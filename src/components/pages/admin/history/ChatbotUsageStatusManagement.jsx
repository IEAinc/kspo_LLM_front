import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { API_ENDPOINT, http } from '../../../../assets/api/commons.js';
import CustomAlert from '../../../commons/admin/CustomAlert.jsx';
import Box from '../../../commons/admin/boxs/Box.jsx';
import AgGrid from '../../../commons/admin/grids/AgGrid.jsx';
import UsageSearchBox from '../../../commons/admin/boxs/UsageSearchBox.jsx';
import Btn from "../../../commons/admin/forms/Btn.jsx";
import AgChart from "../../../commons/admin/chart/AgChart.jsx";

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


  // 상단 요약 및 차트 상태
  const [countAll, setCountAll] = useState([0, 0, 0, 0]); // [todayUsage, todayQuestion, totalUsage, totalQuestion]
  const [chartData, setChartData] = useState([
    { date: "6/20", userCount: 120 },
    { date: "6/21", userCount: 180 },
    { date: "6/22", userCount: 90 },
    { date: "6/23", userCount: 210 },
    { date: "6/24", userCount: 160 },
    { date: "6/25", userCount: 240 },
    { date: "6/26", userCount: 190 },
  ]);
  const chartSeries = [
    {
      type: "line",
      xKey: "date",
      yKey: "userCount",
      yName: "사용자수",
      stroke: "#4D7CFE",
      marker: { enabled: true, fill: "#4D7CFE" },
    },
  ];

  // 총계/오늘 통계는 페이지 최초 로드 시 1회만 조회
  const loadTotalUsage = async () => {
    try {
      const res = await http.get(API_ENDPOINT.HISTORY_TOTAL_USAGE);
      const data = res?.data?.response || res?.data || {};
      const todayUsage = Number(data.todayUsageCount || 0);
      const todayQuestion = Number(data.todayQuestionCount || 0);
      const totalUsage = Number(data.totalUsageCount || 0);
      const totalQuestion = Number(data.totalQuestionCount || 0);
      setCountAll([todayUsage, todayQuestion, totalUsage, totalQuestion]);
    } catch (e) {
      // 통계 조회 실패는 치명적이지 않으므로 토스트 없이 무시
      // 필요시 콘솔 확인
      // console.warn('Failed to load total usage stats', e);
    }
  };

  useEffect(() => {
    loadTotalUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
        currentPage: (body.page || 0),
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


      <div className="items-stretch gap-[18px] w-full mb-[16px]">
        <div className="flex items-stretch gap-[18px] w-full mb-[16px]">
          {/* 금일 이용자 수 */}
          <div className="flex justify-between flex-col w-[25%] py-[20px] px-[20px] rounded-[20px] bg-white br-[#EEF4FF] border-2 relative overflow-hidden">
            <div className="flex justify-between items-start gap-2 mb-[8px] ">
              <p className="text-[24px] font-bold text-black ]">금일 이용자 수</p>
              <p className="text-[24px] font-medium text-gray-500">{countAll[0]} 명</p>
            </div>
          </div>
          {/* 금일 질문 횟수 */}
          <div className="flex justify-between flex-col w-[25%] py-[20px] px-[20px] rounded-[20px] bg-white br-[#EEF4FF] border-2 relative overflow-hidden">
            <div className="flex justify-between items-start gap-2 mb-[8px] ">
              <p className="text-[24px] font-bold text-black ]">금일 질문 횟수</p>
              <p className="text-[24px] font-medium text-gray-500">{countAll[1]} 명</p>
            </div>
          </div>
          {/* 총 이용자 수 */}
          <div className="flex justify-between flex-col w-[25%] py-[20px] px-[20px] rounded-[20px] bg-white br-[#EEF4FF] border-2 relative overflow-hidden">
            <div className="flex justify-between items-start gap-2 mb-[8px] ">
              <p className="text-[24px] font-bold text-black ]">총 이용자 수 </p>
              <p className="text-[24px] font-medium text-gray-500">{countAll[2]} 명</p>
            </div>
          </div>
          {/* 총 질문 횟수 */}
          <div className="flex justify-between flex-col w-[25%] py-[20px] px-[20px] rounded-[20px] bg-white br-[#EEF4FF] border-2 relative overflow-hidden">
            <div className="flex justify-between items-center gap-2 mb-[8px] ">
              <p className="text-[24px] font-bold text-black ]">총 질문 횟수</p>
              <p className="text-[24px] font-medium text-gray-500">{countAll[3]} 명</p>
            </div>
          </div>
        </div>
        {/* 차트 */}
        <div className="w-[100%] py-[20px] px-[20px] rounded-[20px] bg-white br-[#EEF4FF] border-2">
          <div className="flex font-bold text-[24px] mb-[4px]">이용자 추이</div>
          {/* 차트 컴포넌트 */}
          <AgChart
              data={chartData}
              series={chartSeries}
              legendOptions={{
                enabled: true,
                position: "bottom",
                alignment: "start"
              }}
              additionalOptions={{
                // 추가 설정
                padding: {
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20
                }
              }}
          />
        </div>
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
          onPageChange={(page) => fetchUsage({ ...searchParams, page })}
          onPageSizeChange={(size) => fetchUsage({ ...searchParams, page: 1, size })}
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