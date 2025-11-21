import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {API_ENDPOINT, http} from '../../../../assets/api/commons.js';
import CustomAlert from '../../../commons/admin/CustomAlert.jsx';
import Box from "../../../commons/admin/boxs/Box.jsx";
import AgGrid from "../../../commons/admin/grids/AgGrid.jsx";
import AdminSearchBox from "../../../commons/admin/boxs/SearchBox.jsx";
import Btn from "../../../commons/admin/forms/Btn.jsx";

const DocumentManagement = () => {
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
  const [searchParams, setSearchParams] = useState({ page: 1, size: 10, docType: null, fileName: null, startDate: null, endDate: null });

  const handleRowClick = (id) => {
    const basePath = location.pathname; // 현재 경로 가져오기
    navigate(`${basePath}/detail/${String(id)}`); // 동적 경로 생성
  }

  const dateFormatter = (params) => {
    if (!params.value) return '';
    const date = new Date(params.value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 컬럼 정의
  useEffect(() => {
    setGridColumns([
      { headerName: 'NO', field: "number", cellClass: 'text-center', width: 70 ,suppressSizeToFit: true,
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
      { headerName: '문서유형', field: 'docTypeName', flex: 1, cellClass: 'text-center', width: 90},
      { headerName: '파일명', field: 'fileName', flex: 1, cellClass: 'text-left'},
      {
        headerName: '사용 여부', field: 'useYn', flex: 1, cellClass: 'text-center', width: 90,
        valueFormatter: (p) => (p.value === 'Y' ? '사용' : '미사용')
      },
      { headerName: '등록자', field: 'id', flex: 1, cellClass: 'text-center', width: 60},
      { headerName: '등록일', field: 'created', valueFormatter: (p) => (dateFormatter(p)), flex: 1, cellClass: 'text-center', width: 120},
      { headerName: '수정자', field: 'updatedId', flex: 1, cellClass: 'text-center', width: 60},
      { headerName: '수정일', field: 'updated', valueFormatter: (p) => (dateFormatter(p)), flex: 1, cellClass: 'text-center', width: 120},
      {
        headerName: "상세보기",
        field: 'regulationDocsSeq',
        width: 100,
        suppressSizeToFit: true,
        cellClass: 'flex-center',
        cellRenderer: (params) => {
          return (
              <Btn size="xxs" onClick={() => handleRowClick(params.data.regulationDocsSeq)}>
                상세보기
              </Btn>
          );
        },
      },
    ]);
  }, []);

  // 데이터 조회
  const fetchDocuments = async (criteria) => {
    const params = { ...(criteria || searchParams) };
    setSearchParams(params);
    try {
      const res = await http.get(API_ENDPOINT.DOCS_PAGE, {
        params: {
          page: params.page ?? 1,
          size: params.size ?? 10,
          docType: params.docType || undefined,
          fileName: params.fileName || undefined,
          startDate: params.startDate || undefined,
          endDate: params.endDate || undefined,
        },
      });

      // 서버 응답 매핑
      const body = res?.data?.response || {};
      const content = Array.isArray(body?.content) ? body.content : [];
      const mapped = content.map((it) => ({
        id: it.regulationDocsSeq, // 그리드 선택/삭제용 고유키
        ...it,
      }));
      setGridData(mapped);
      setPageData({
        totalElements: body.totalElements || 0,
        currentPage: (body.page || 1),
        pageSize: body.size || 10,
      });
    } catch (e) {
      setAlertState({
        isOpen: true,
        title: '오류',
        message: '문서 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        iconMode: 'warn',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: () => setAlertState((p) => ({ ...p, isOpen: false })),
      });
    }
  };

  // 최초 로드 시 목록 조회
  useEffect(() => {
    fetchDocuments(searchParams);
  }, [location.pathname]);

  // Grid 이벤트 핸들러 (필요 시 확장)
  const handleDataUpdate = (updatedData, gridApi) => {
    const selected = gridApi?.getSelectedRows?.() || [];
    if (!selected.length) {
      setAlertState({
        isOpen: true,
        title: '안내',
        message: '삭제할 항목을 선택하세요.',
        iconMode: 'warn',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: () => setAlertState((p) => ({ ...p, isOpen: false })),
      });
      return;
    }
    const regulationDocsSeqList = selected
      .map((r) => r.regulationDocsSeq ?? r.id ?? null)
      .filter((v) => v !== null && v !== undefined);
    if (!regulationDocsSeqList.length) {
      setAlertState({
        isOpen: true,
        title: '오류',
        message: '선택한 항목에 유효한 식별자(regulationDocsSeq)가 없습니다.',
        iconMode: 'warn',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: () => setAlertState((p) => ({ ...p, isOpen: false })),
      });
      return;
    }

    setAlertState({
      isOpen: true,
      title: '삭제 확인',
      message: `선택한 ${regulationDocsSeqList.length}건을 삭제하시겠습니까?`,
      iconMode: 'warn',
      confirmButton: { text: '삭제', colorMode: true },
      cancelButton: { text: '취소' },
      onConfirm: async () => {
        try {
          await http.delete(API_ENDPOINT.DOCS_DELETE, {
            data: { regulationDocsSeqList },
          });
          setAlertState({
            isOpen: true,
            title: '완료',
            message: '삭제가 완료되었습니다.',
            iconMode: 'warn',
            confirmButton: { text: '확인', colorMode: true },
            cancelButton: false,
            onConfirm: () => setAlertState((p) => ({ ...p, isOpen: false })),
          });
          fetchDocuments(searchParams);
        } catch (e) {
          setAlertState({
            isOpen: true,
            title: '오류',
            message: '삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            iconMode: 'warn',
            confirmButton: { text: '확인', colorMode: true },
            cancelButton: false,
            onConfirm: () => setAlertState((p) => ({ ...p, isOpen: false })),
          });
        }
      },
      onCancel: () => setAlertState((p) => ({ ...p, isOpen: false })),
    });
  };
  const handleRegisterClick = () => {
    navigate('/ksponcoadministrator/document/register');
  };
  const onEditClick = (gridApi) => {
    const selectedRows = gridApi?.getSelectedRows?.() || [];
    if (selectedRows.length !== 1) {
      setAlertState({
        isOpen: true,
        title: '경고',
        message: selectedRows.length === 0 ? '수정할 항목을 선택하세요.' : '수정은 1개 항목만 가능합니다.',
        iconMode: 'warn',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: () => setAlertState((p) => ({ ...p, isOpen: false })),
      });
      return;
    }
    const row = selectedRows[0];
    const id = row.regulationDocsSeq || row.id;
    if (!id) {
      setAlertState({
        isOpen: true,
        title: '오류',
        message: '선택한 항목의 식별자를 찾을 수 없습니다.',
        iconMode: 'warn',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: () => setAlertState((p) => ({ ...p, isOpen: false })),
      });
      return;
    }
    navigate(`/ksponcoadministrator/document/update/${encodeURIComponent(String(id))}`);
  };

  return (
    <div>
      <div className="w-full mb-[16px]">
        <AdminSearchBox defaultSearch={searchParams} onSearch={fetchDocuments} />
      </div>
      <Box>
        <AgGrid
          rowDeselection={true}
          rowData={gridData}
          pageData={pageData}
          columnDefs={gridColumns}
          height={463}
          indicator={{ excel: true, edit: true, register: true, delete: true }}
          isCheckboxMode={true}
          onDataUpdate={handleDataUpdate}
          onRegisterClick={handleRegisterClick}
          onEditClick={onEditClick}
          resizable={true}
          sortable={true}
          onPageChange={(page) => fetchDocuments({ ...searchParams, page })}
          onPageSizeChange={(size) => fetchDocuments({ ...searchParams, page: 1, size })}
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

export default DocumentManagement;