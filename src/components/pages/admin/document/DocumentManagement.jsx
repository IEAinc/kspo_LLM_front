import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

const DocumentManagement = () => {
    //모달 관련련
    const [modalText, setModalText] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    // 모달 임시추가
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);
    const [userCompany, setUserCompany] = useState("");
    const [userId, setUserId] = useState("");
    // CustomAlert 상태 관리
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        type: 'info',
        message: '',
        iconMode: 'warn',
        confirmButton: true,
        cancelButton: true,
        onConfirm: () => {
        },
        onCancel: () => {
        }
    });
    useEffect(() => {
    }, [location.pathname])
    // Alert 닫기 함수
    const hideAlert = () => {
        setAlertState({
            ...alertState,
            isOpen: false
        });
    };
    // 확인 버튼 클릭 동작
    const handleConfirm = () => {
        setIsModalOpen(false); // 모달 닫기
    };

    // 취소 버튼 클릭 동작
    const handleCancel = () => {
        setIsModalOpen(false); // 모달 닫기
    };

    /* AgGrid */
    const [gridData, setGridData] = useState([]);
    const [gridColumns, setGridColumns] = useState([]);
    const [gridCount, setGridCount] = useState(0);
    const [searchText, setSearchText] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedName, setSelectedName] = useState(null);

    // 최종 반환
    return (
        <div>
            {/*<div className="w-full mb-[16px]">
                <SearchWrap onSearch={fetchListData}/>
            </div>
            <Box>
                <AgGrid
                    rowDeselection={true}
                    rowData={gridData}
                    columnDefs={gridColumns}
                    height={463}
                    indicator={{
                        excel: true,
                        edit: true,
                        register: true,
                        delete: true,
                    }}
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
            />*/}
        </div>
    );
}
export default DocumentManagement;