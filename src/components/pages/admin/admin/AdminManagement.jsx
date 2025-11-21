import React, {useMemo} from 'react';
import {API_ENDPOINT, http} from '../../../../assets/api/commons.js';
import AdminGridPage from '../../../commons/admin/AdminGridPage.jsx';
import Btn from "../../../commons/admin/forms/Btn.jsx";
import {createDateFormatter, parseEmail} from '../../../../utils/adminUtils.js';
import Input from "../../../commons/admin/forms/Input.jsx";
import CustomDatePicker from "../../../commons/admin/forms/CustomDatepicker.jsx";

const AdminManagement = () => {
    const columns = useMemo(() => ([
        {headerName: '성함', field: 'name', flex: 1, cellClass: 'text-center', width: 120},
        {headerName: '아이디', field: 'id', flex: 1, cellClass: 'text-center', width: 120},
        {headerName: '이메일', field: 'email', flex: 1, cellClass: 'text-center', width: 180},
        {headerName: '연락처', field: 'tel', flex: 1, cellClass: 'text-center', width: 140},
        {
            headerName: '최종로그인',
            field: 'updated',
            valueFormatter: createDateFormatter(),
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
                <Btn size="xxs"
                     onClick={() => window.location.href = `/ksponcoadministrator/adminManagement/detail/${encodeURIComponent(params.data.id)}`}>
                    상세보기
                </Btn>
            ),
        },
    ]), []);

    return (
        <AdminGridPage
            apiEndpoint={(params) => http.get(API_ENDPOINT.ADMIN_USER_PAGE, {params})}
            deleteEndpoint={(data) => http.delete(API_ENDPOINT.ADMIN_USER_DELETE, {data})}
            initialParams={{page: 1, size: 10, name: null, startDate: null, endDate: null}}
            rowMapper={(content) => content.map((it) => ({
                rowKey: it.adminSeq,
                ...it,
                email: parseEmail(it.email),
            }))}
            columns={columns}
            gridOptions={{
                height: 463,
                indicator: {excel: true, edit: true, register: true, delete: true},
            }}
            renderSearchFields={(params, onParamsChange) => (
                <>
                    <Input
                        labelName="성함/아이디"
                        type="text"
                        placeholder="성함 또는 아이디"
                        value={params.name || ''}
                        onChange={(e) => onParamsChange({...params, name: e.target.value})}
                        options={{widthSize: 'lg', labelSize: 'lg'}}
                    />
                    <CustomDatePicker
                        options={{widthSize: 'md', labelSize: 'sm'}}
                        startDate={params.startDate}
                        endDate={params.endDate}
                        onStartDateChange={(date) => onParamsChange({...params, startDate: date})}
                        onEndDateChange={(date) => onParamsChange({...params, endDate: date})}
                    />
                </>
            )}
            onRegister={({navigate}) => navigate('/ksponcoadministrator/adminManagement/register', {state: {mode: 'register'}})}
            onEdit={(gridApi, row, {navigate}) => navigate('/ksponcoadministrator/adminManagement/register', {
                state: {
                    mode: 'update',
                    userId: row.id
                }
            })}
            getDeleteIds={(row) => row.adminSeq ?? row.rowKey}
            deleteIdField="adminSeqList"
        />
    );
};

export default AdminManagement;
