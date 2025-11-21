import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomAlert from './CustomAlert.jsx';
import Box from './boxs/Box.jsx';
import AgGrid from './grids/AgGrid.jsx';
import SearchPanel from './boxs/SearchPanel.jsx';
import useAdminAlert from '../../../hooks/useAdminAlert.js';
import useServerGrid from '../../../hooks/useServerGrid.js';

/**
 * 범용 관리자 그리드 페이지 컴포넌트
 * 검색 + 페이징 그리드 + CRUD 기능을 제공하는 공통 레이아웃
 *
 * @param {Object} config - 페이지 설정
 * @param {string} config.apiEndpoint - 조회 API 엔드포인트
 * @param {string} config.deleteEndpoint - 삭제 API 엔드포인트 (선택)
 * @param {Object} config.initialParams - 초기 검색 파라미터
 * @param {Function} config.rowMapper - 서버 데이터 → 그리드 데이터 변환 함수
 * @param {Array} config.columns - AG Grid 컬럼 정의
 * @param {Object} config.gridOptions - AG Grid 추가 옵션 (height, indicator 등)
 * @param {Function} config.renderSearchFields - 검색 필드 렌더 함수 (params, onParamsChange) => ReactNode
 * @param {Function} config.onRegister - 등록 버튼 클릭 핸들러
 * @param {Function} config.onEdit - 수정 버튼 클릭 핸들러 (gridApi, selectedRows) => void
 * @param {Function} config.onDelete - 삭제 버튼 클릭 핸들러 (선택, 기본 구현 사용 시 생략)
 * @param {Function} config.getDeleteIds - 선택된 행에서 삭제 ID 추출 함수 (row => id)
 * @param {string} config.deleteIdField - 삭제 API에 전송할 ID 필드명 (예: 'adminSeqList')
 */
const AdminGridPage = ({
  apiEndpoint,
  deleteEndpoint,
  initialParams = { page: 1, size: 10 },
  rowMapper = (rows) => rows,
  columns = [],
  gridOptions = {},
  renderSearchFields,
  onRegister,
  onEdit,
  onDelete,
  getDeleteIds,
  deleteIdField,
}) => {
  const navigate = useNavigate();
  const { alertState, hideAlert, showAlert } = useAdminAlert();

  const { rows, pageData, params, load, changePage, changePageSize } = useServerGrid({
    fetcher: (criteria) => {
      const { page, size, ...rest } = criteria;
      const queryParams = { page: page ?? 1, size: size ?? 10 };
      Object.keys(rest).forEach(key => {
        if (rest[key] !== null && rest[key] !== undefined && rest[key] !== '') {
          queryParams[key] = rest[key];
        }
      });
      return apiEndpoint(queryParams);
    },
    initialParams,
    mapper: rowMapper,
  });

  const handleDelete = (gridApi) => {
    if (onDelete) {
      return onDelete(gridApi, { showAlert, hideAlert, load, params });
    }

    if (!deleteEndpoint || !getDeleteIds || !deleteIdField) {
      showAlert({ title: '오류', message: '삭제 기능이 설정되지 않았습니다.' });
      return;
    }

    const selected = gridApi?.getSelectedRows?.() || [];
    const ids = selected.map(getDeleteIds).filter(Boolean);

    if (!ids.length) {
      showAlert({ title: '안내', message: '삭제할 항목을 선택하세요.' });
      return;
    }

    showAlert({
      title: '삭제 확인',
      message: `선택한 ${ids.length}건을 삭제하시겠습니까?`,
      cancelButton: { text: '취소' },
      onConfirm: async () => {
        try {
          await deleteEndpoint({ [deleteIdField]: ids });
          showAlert({
            title: '완료',
            message: '삭제가 완료되었습니다.',
            confirmButton: { text: '확인', colorMode: true },
            onConfirm: hideAlert,
          });
          load(params);
        } catch (error) {
          showAlert({ title: '오류', message: '삭제 중 오류가 발생했습니다.' });
        }
      },
      onCancel: hideAlert,
    });
  };

  const handleEdit = (gridApi) => {
    if (!onEdit) return;

    const selectedRows = gridApi?.getSelectedRows?.() || [];
    if (selectedRows.length !== 1) {
      showAlert({
        title: '경고',
        message: selectedRows.length === 0 ? '수정할 항목을 선택하세요.' : '수정은 1개 항목만 가능합니다.',
      });
      return;
    }

    onEdit(gridApi, selectedRows[0], { navigate, showAlert, hideAlert });
  };

  const handleRegister = () => {
    if (onRegister) {
      onRegister({ navigate, showAlert, hideAlert });
    }
  };

  const handleSearchSubmit = () => {
    load({ ...params, page: 1 });
  };

  const handleSearchReset = () => {
    const resetParams = { page: 1, size: params.size };
    Object.keys(initialParams).forEach(key => {
      if (key !== 'page' && key !== 'size') {
        resetParams[key] = null;
      }
    });
    load(resetParams);
  };

  const {
    height = 463,
    indicator = {},
    isCheckboxMode = true,
    sortable = true,
    resizable = false,
    ...otherGridOptions
  } = gridOptions;

  return (
    <div className="space-y-4">
      {renderSearchFields && (
        <SearchPanel onSubmit={handleSearchSubmit} onReset={handleSearchReset}>
          {renderSearchFields(params, (updates) => load({ ...params, ...updates, page: 1 }))}
        </SearchPanel>
      )}

      <Box>
        <AgGrid
          rowDeselection
          rowData={rows}
          pageData={pageData}
          columnDefs={columns}
          height={height}
          indicator={indicator}
          isCheckboxMode={isCheckboxMode}
          sortable={sortable}
          resizable={resizable}
          onDataUpdate={(_, gridApi) => handleDelete(gridApi)}
          onRegisterClick={indicator.register ? handleRegister : undefined}
          onEditClick={indicator.edit ? handleEdit : undefined}
          onPageChange={changePage}
          onPageSizeChange={changePageSize}
          {...otherGridOptions}
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

export default AdminGridPage;

