import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { API_ENDPOINT, http } from '../../../../assets/api/commons.js';
import CustomAlert from '../../../commons/admin/CustomAlert.jsx';
import Box from '../../../commons/admin/boxs/Box.jsx';
import AgGrid from '../../../commons/admin/grids/AgGrid.jsx';
import AdminUserSearchBox from '../../../commons/admin/boxs/AdminUserSearchBox.jsx';

const AdminManagement = () => {
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
  const [gridColumns, setGridColumns] = useState([]);
  const [searchParams, setSearchParams] = useState({ page: 0, size: 10, name: null, id: null, startDate: null, endDate: null });

  const dateFormatter = (params) => {
    if (!params.value) return '';
    const date = new Date(params.value);
    if (isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 컬럼 정의
  useEffect(() => {
    setGridColumns([
      { headerName: '성함', field: 'name', flex: 1, cellClass: 'text-center', width: 120 },
      { headerName: '아이디', field: 'id', flex: 1, cellClass: 'text-center', width: 120 },
      { headerName: '이메일', field: 'email', flex: 1, cellClass: 'text-center', width: 180 },
      { headerName: '연락처', field: 'tel', flex: 1, cellClass: 'text-center', width: 140 },
      { headerName: '최종로그인', field: 'updated', valueFormatter: (p) => dateFormatter(p), flex: 1, cellClass: 'text-center', width: 140 },
      { headerName: '허용 IP', field: 'ip', flex: 1, cellClass: 'text-center', width: 160 },
    ]);
  }, []);

  // 데이터 조회
  const fetchAdmins = async (criteria) => {
    const params = { ...(criteria || searchParams) };
    setSearchParams(params);
    try {
      const res = await http.get(API_ENDPOINT.ADMIN_USER_PAGE, {
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
          name: params.name || undefined,
          id: params.id || undefined,
          startDate: params.startDate || undefined,
          endDate: params.endDate || undefined,
        },
      });

      const body = res?.data?.response || {};
      const content = Array.isArray(body?.content) ? body.content : [];
      const mapped = content.map((it) => {
        const emailText = typeof it.email === 'string' ? it.email : (it.email?.value || it.email?.address || '');
        return {
          id: it.adminSeq,
          ...it,
          email: emailText,
        };
      });
      setGridData(mapped);
    } catch (e) {
      setAlertState({
        isOpen: true,
        title: '오류',
        message: '관리자 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        iconMode: 'warn',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: () => setAlertState((p) => ({ ...p, isOpen: false })),
      });
    }
  };

  // 최초 로드 시 목록 조회
  useEffect(() => {
    fetchAdmins(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleDataUpdate = () => {
    setAlertState({
      isOpen: true,
      title: '안내',
      message: '삭제 기능은 추후 제공 예정입니다.',
      iconMode: 'warn',
      confirmButton: { text: '확인', colorMode: true },
      cancelButton: false,
      onConfirm: () => setAlertState((p) => ({ ...p, isOpen: false })),
    });
  };

  const handleRegisterClick = () => {
    setAlertState({
      isOpen: true,
      title: '안내',
      message: '등록 기능은 추후 제공 예정입니다.',
      iconMode: 'warn',
      confirmButton: { text: '확인', colorMode: true },
      cancelButton: false,
      onConfirm: () => setAlertState((p) => ({ ...p, isOpen: false })),
    });
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
    setAlertState({
      isOpen: true,
      title: '안내',
      message: '수정 기능은 추후 제공 예정입니다.',
      iconMode: 'warn',
      confirmButton: { text: '확인', colorMode: true },
      cancelButton: false,
      onConfirm: () => setAlertState((p) => ({ ...p, isOpen: false })),
    });
  };

  return (
    <div>
      <div className="w-full mb-[16px]">
        <AdminUserSearchBox defaultSearch={searchParams} onSearch={fetchAdmins} />
      </div>
      <Box>
        <AgGrid
          rowDeselection={true}
          rowData={gridData}
          columnDefs={gridColumns}
          height={463}
          indicator={{ excel: true, edit: true, register: true, delete: true }}
          isCheckboxMode={true}
          onDataUpdate={handleDataUpdate}
          onRegisterClick={handleRegisterClick}
          onEditClick={onEditClick}
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

export default AdminManagement;