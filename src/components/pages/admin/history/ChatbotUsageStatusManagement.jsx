import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { API_ENDPOINT, http } from '../../../../assets/api/commons.js';
import CustomAlert from '../../../commons/admin/CustomAlert.jsx';
import Box from '../../../commons/admin/boxs/Box.jsx';
import AgGrid from '../../../commons/admin/grids/AgGrid.jsx';
import Btn from "../../../commons/admin/forms/Btn.jsx";
import AgChart from "../../../commons/admin/chart/AgChart.jsx";
import SearchPanel from '../../../commons/admin/boxs/SearchPanel.jsx';
import CustomDatePicker from '../../../commons/admin/forms/CustomDatepicker.jsx';
import useAdminAlert from '../../../../hooks/useAdminAlert.js';
import useServerGrid from '../../../../hooks/useServerGrid.js';
import { formatDate, createDateFormatter, createNoColumnValueGetter } from '../../../../utils/adminUtils.js';

const StatCard = ({ title, value }) => (
  <div className="flex justify-between flex-col w-[25%] py-[20px] px-[20px] rounded-[20px] bg-white border-2 relative overflow-hidden">
    <div className="flex justify-between items-start gap-2 mb-[8px]">
      <p className="text-[18px] font-bold text-black">{title}</p>
      <p className="text-[18px] font-medium text-gray-500">{value} 명</p>
    </div>
  </div>
);

const ChatbotUsageStatusManagement = () => {
  const location = useLocation();
  const { alertState, hideAlert } = useAdminAlert();
  const [countAll, setCountAll] = useState([0, 0, 0, 0]);
  const [chartType, setChartType] = useState('usage');
  const [chartData, setChartData] = useState([]);

  const chartSeries = useMemo(() => {
    if (chartType === 'usage') {
      return [
        {
          type: 'line',
          xKey: 'date',
          yKey: 'usageCount',
          yName: '이용자 수',
          stroke: '#4D7CFE',
          marker: { enabled: true, fill: '#4D7CFE' },
        },
      ];
    }
    if (chartType === 'question') {
      return [
        {
          type: 'line',
          xKey: 'date',
          yKey: 'questionCount',
          yName: '질문 횟수',
          stroke: '#2ECC71',
          marker: { enabled: true, fill: '#2ECC71' },
        },
      ];
    }
    // satisfaction: 3 lines
    return [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'thumbsUpCount',
        yName: '좋아요',
        stroke: '#6A0DAD', // purple
        marker: { enabled: true, fill: '#6A0DAD' },
      },
      {
        type: 'line',
        xKey: 'date',
        yKey: 'thumbsDownCount',
        yName: '싫어요',
        stroke: '#FF3B30', // red
        marker: { enabled: true, fill: '#FF3B30' },
      },
      {
        type: 'line',
        xKey: 'date',
        yKey: 'noResponseCount',
        yName: '무응답',
        stroke: '#000000', // black
        marker: { enabled: true, fill: '#000000' },
      },
    ];
  }, [chartType]);

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

  // Grid 상태
  const { rows, pageData, params, load, changePage, changePageSize } = useServerGrid({
    fetcher: (criteria) => http.get(API_ENDPOINT.HISTORY_USAGE, {
      params: {
        page: criteria.page ?? 1,
        size: criteria.size ?? 10,
        startDate: criteria.startDate || undefined,
        endDate: criteria.endDate || undefined,
      },
    }),
    initialParams: { page: 1, size: 10, startDate: null, endDate: null },
    mapper: (content) => content.map((it, idx) => {
      const thumbsUp = it.thumbsUpCount ?? 0;
      const thumbsDown = it.thumbsDownCount ?? 0;
      const noResp = it.noResponseCount ?? 0;
      return {
        id: `${it.date ?? ''}-${idx}`,
        satisfactionSummary: `만족 ${thumbsUp}건/불만족 ${thumbsDown}건/무응답 ${noResp}건`,
        ...it,
      };
    }),
  });

  const gridColumns = useMemo(() => [
    {
      headerName: 'NO',
      field: 'number',
      cellClass: 'text-center',
      suppressSizeToFit: true,
      valueGetter: createNoColumnValueGetter(),
    },
    { headerName: '날짜', field: 'date', valueFormatter: createDateFormatter(), flex: 1, cellClass: 'text-center'},
    { headerName: '이용자 수', field: 'usageCount', flex: 1, cellClass: 'text-center'},
    { headerName: '질문 횟수', field: 'questionCount', flex: 1, cellClass: 'text-center'},
    { headerName: '만족도 현황', field: 'satisfactionSummary', flex: 2, cellClass: 'text-center'},
  ], []);

  const loadChart = async (criteria) => {
    try {
      const res = await http.get(API_ENDPOINT.HISTORY_TOTAL_USAGE_CHART, {
        params: {
          startDate: criteria.startDate || undefined,
          endDate: criteria.endDate || undefined,
        },
      });
      const list = Array.isArray(res?.data?.response) ? res.data.response : (Array.isArray(res?.data) ? res.data : []);
      const mapped = list.map((row) => ({
        date: formatDate(row.date, 'MM/dd'),
        usageCount: Number(row.usageCount ?? 0),
        questionCount: Number(row.questionCount ?? 0),
        thumbsUpCount: Number(row.thumbsUpCount ?? 0),
        thumbsDownCount: Number(row.thumbsDownCount ?? 0),
        noResponseCount: Number(row.noResponseCount ?? 0),
      }));
      setChartData(mapped);
    } catch (e) {
      setChartData([]);
    }
  };

  const handleSearch = (nextParams) => {
    load(nextParams);
    loadChart(nextParams);
  };

  useEffect(() => {
    loadTotalUsage();
    load(params);
    loadChart(params);
  }, [location.pathname]);

  return (
    <div className="space-y-4">
      <SearchPanel
        onSubmit={() => handleSearch({ ...params, page: 1 })}
        onReset={() => handleSearch({ page: 1, size: params.size, startDate: null, endDate: null })}
      >
        <CustomDatePicker
          options={{ widthSize: 'md', labelSize: 'sm' }}
          startDate={params.startDate}
          endDate={params.endDate}
          onStartDateChange={(startDate) => handleSearch({ ...params, page: 1, startDate })}
          onEndDateChange={(endDate) => handleSearch({ ...params, page: 1, endDate })}
        />
      </SearchPanel>


      <div className="items-stretch gap-[18px] w-full mb-[16px]">
        <div className="flex items-stretch gap-[18px] w-full mb-[16px]">
          {['금일 이용자 수', '금일 질문 횟수', '총 이용자 수', '총 질문 횟수'].map((title, idx) => (
            <StatCard key={title} title={title} value={countAll[idx]} />
          ))}
        </div>
        {/* 차트 */}
        <div className="w-[100%] py-[20px] px-[20px] rounded-[20px] bg-white br-[#EEF4FF] border-2">
          <div className="flex items-center justify-between mb-[8px]">
            <div className="font-bold text-[18px]">
              {chartType === 'usage' ? '이용자 추이' : chartType === 'question' ? '질문횟수 추이' : '만족도 추이'}
            </div>
            <div className="flex gap-2">
              <Btn size="xs" onClick={() => setChartType('usage')} colorMode={chartType==='usage'}>
                이용자 추이
              </Btn>
              <Btn size="xs" onClick={() => setChartType('question')} colorMode={chartType==='question'}>
                질문횟수 추이
              </Btn>
              <Btn size="xs" onClick={() => setChartType('satisfaction')} colorMode={chartType==='satisfaction'}>
                만족도 추이
              </Btn>
            </div>
          </div>
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
          rowData={rows}
          pageData={pageData}
          columnDefs={gridColumns}
          height={463}
          indicator={{ excel: true }}
          isCheckboxMode={false}
          sortable={true}
          onPageChange={changePage}
          onPageSizeChange={changePageSize}
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

