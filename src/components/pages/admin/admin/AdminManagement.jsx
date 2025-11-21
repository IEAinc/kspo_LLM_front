import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {API_ENDPOINT, http} from '../../../../assets/api/commons.js';
import CustomAlert from '../../../commons/admin/CustomAlert.jsx';
import Box from '../../../commons/admin/boxs/Box.jsx';
import AgGrid from '../../../commons/admin/grids/AgGrid.jsx';
import AdminUserSearchBox from '../../../commons/admin/boxs/AdminUserSearchBox.jsx';
import Btn from "../../../commons/admin/forms/Btn.jsx";

const AdminManagement = () => {
    const location = useLocation();
    const navigate = useNavigate();

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
    const hideAlert = () => setAlertState((prev) => ({...prev, isOpen: false}));

    // Grid 상태
    const [gridData, setGridData] = useState([]);
    const [pageData, setPageData] = useState({});
    const [gridColumns, setGridColumns] = useState([]);
    const [searchParams, setSearchParams] = useState({
        page: 1,
        size: 10,
        name: null,
        id: null,
        startDate: null,
        endDate: null
    });

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
            {headerName: '성함', field: 'name', flex: 1, cellClass: 'text-center', width: 120},
            {headerName: '아이디', field: 'id', flex: 1, cellClass: 'text-center', width: 120},
            {headerName: '이메일', field: 'email', flex: 1, cellClass: 'text-center', width: 180},
            {headerName: '연락처', field: 'tel', flex: 1, cellClass: 'text-center', width: 140},
            {
                headerName: '최종로그인',
                field: 'updated',
                valueFormatter: (p) => dateFormatter(p),
                flex: 1,
                cellClass: 'text-center',
                width: 140
            },
            {headerName: '허용 IP', field: 'ip', flex: 1, cellClass: 'text-center', width: 160},
            {
                headerName: '상세보기',
                field: 'detail',
                width: 100,
                suppressSizeToFit: true,
                cellClass: 'flex-center',
                cellRenderer: (params) => (
                    <Btn size="xxs" onClick={() => navigate(`/ksponcoadministrator/adminManagement/detail/${encodeURIComponent(params.data.id)}`)}>
                        상세보기
                    </Btn>
                ),
            },
        ]);
    }, [navigate]);

    // 데이터 조회
    const fetchAdmins = async (criteria) => {
        const params = {...(criteria || searchParams)};
        setSearchParams(params);
        try {
            const res = await http.get(API_ENDPOINT.ADMIN_USER_PAGE, {
                params: {
                    page: params.page ?? 1,
                    size: params.size ?? 10,
                    name: params.name || undefined,
                    startDate: params.startDate || undefined,
                    endDate: params.endDate || undefined,
                },
            });

            const body = res?.data?.response || {};
            const content = Array.isArray(body?.content) ? body.content : [];
            const mapped = content.map((it) => {
                const emailText = typeof it.email === 'string' ? it.email : (it.email?.value || it.email?.address || '');
                return {
                    rowKey: it.adminSeq, // 그리드 내부 키
                    ...it,               // 유지: id = 로그인 아이디
                    email: emailText,
                };
            });
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
                message: '관리자 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
                iconMode: 'warn',
                confirmButton: {text: '확인', colorMode: true},
                cancelButton: false,
                onConfirm: () => setAlertState((p) => ({...p, isOpen: false})),
            });
        }
    };

    // 최초 로드 시 목록 조회
    useEffect(() => {
        fetchAdmins(searchParams);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

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
        const adminSeqList = selected
            .map((r) => r.adminSeq ?? r.rowKey ?? null)
            .filter((v) => v !== null && v !== undefined);
        if (!adminSeqList.length) {
            setAlertState({
                isOpen: true,
                title: '오류',
                message: '선택한 항목에 유효한 식별자(adminSeq)가 없습니다.',
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
            message: `선택한 ${adminSeqList.length}건을 삭제하시겠습니까?`,
            iconMode: 'warn',
            confirmButton: { text: '삭제', colorMode: true },
            cancelButton: { text: '취소' },
            onConfirm: async () => {
                try {
                    // axios delete with payload in config.data
                    await http.delete(API_ENDPOINT.ADMIN_USER_DELETE, {
                        data: { adminSeqList },
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
                    // 재조회
                    fetchAdmins(searchParams);
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
        navigate('/ksponcoadministrator/adminManagement/register', {state: {mode: 'register'}});
    };

    const onEditClick = (gridApi) => {
        const selectedRows = gridApi?.getSelectedRows?.() || [];
        if (selectedRows.length !== 1) {
            setAlertState({
                isOpen: true,
                title: '경고',
                message: selectedRows.length === 0 ? '수정할 항목을 선택하세요.' : '수정은 1개 항목만 가능합니다.',
                iconMode: 'warn',
                confirmButton: {text: '확인', colorMode: true},
                cancelButton: false,
                onConfirm: () => setAlertState((p) => ({...p, isOpen: false})),
            });
            return;
        }
        const row = selectedRows[0];
        // row.id는 로그인 아이디를 의미함 (상세 조회 키)
        navigate('/ksponcoadministrator/adminManagement/register', {state: {mode: 'update', userId: row.id}});
    };

    return (
        <div>
            <div className="w-full mb-[16px]">
                <AdminUserSearchBox defaultSearch={searchParams} onSearch={fetchAdmins}/>
            </div>
            <Box>
                <AgGrid
                    rowDeselection={true}
                    rowData={gridData}
                    pageData={pageData}
                    columnDefs={gridColumns}
                    height={463}
                    indicator={{excel: true, edit: true, register: true, delete: true}}
                    isCheckboxMode={true}
                    onDataUpdate={handleDataUpdate}
                    onRegisterClick={handleRegisterClick}
                    onEditClick={onEditClick}
                    sortable={true}
                    onPageChange={(page) => fetchAdmins({ ...searchParams, page })}
                    onPageSizeChange={(size) => fetchAdmins({ ...searchParams, page: 1, size })}
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