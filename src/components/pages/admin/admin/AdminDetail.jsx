import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Box from '../../../commons/admin/boxs/Box.jsx';
import Input from '../../../commons/admin/forms/Input.jsx';
import Btn from '../../../commons/admin/forms/Btn.jsx';
import CustomAlert from '../../../commons/admin/CustomAlert.jsx';
import {http, API_ENDPOINT} from '../../../../assets/api/commons.js';
import Select from "../../../commons/admin/forms/Select.jsx";

// 센터 옵션 (등록 화면과 동일하게 사용)
const scIdOptions = [
    {value: '01', label: '올림픽공원스포츠센터'},
    {value: '03', label: '분당올림픽스포츠센터'},
    {value: '05', label: '일산올림픽스포츠센터'},
    {value: '06', label: '올림픽수영장'},
    {value: '07', label: '올팍축구장'},
];

const AdminDetail = () => {
    const navigate = useNavigate();
    const {id} = useParams();

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
    const hideAlert = () => setAlertState((p) => ({...p, isOpen: false}));

    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState({
        company: '',
        name: '',
        userId: '',
        email: '',
        tel: '',
        ip: '',
    });

    const goList = () => navigate('/ksponcoadministrator/adminManagement');

    const toEmailText = (emailObjOrStr) => {
        if (!emailObjOrStr) return '';
        if (typeof emailObjOrStr === 'string') return emailObjOrStr;
        return emailObjOrStr.value || emailObjOrStr.address || '';
    };

    useEffect(() => {
        const load = async () => {
            if (!id) {
                setAlertState({
                    isOpen: true,
                    title: '오류',
                    message: '잘못된 접근입니다. 목록으로 이동합니다.',
                    iconMode: 'warn',
                    confirmButton: {text: '확인', colorMode: true},
                    cancelButton: false,
                    onConfirm: () => {
                        hideAlert();
                        goList();
                    },
                });
                return;
            }
            try {
                const res = await http.get(`${API_ENDPOINT.ADMIN_USER_DETAIL}/${encodeURIComponent(id)}`);
                const data = res?.data?.response || res?.data || {};
                const center = scIdOptions.find((o) => o.value === data.scId)?.label || '';
                const emailText = toEmailText(data.email);
                setDetail({
                    company: center,
                    name: data.name || '',
                    userId: data.id || id,
                    email: emailText,
                    tel: data.tel || data.phone || '',
                    ip: data.ip || '',
                });
            } catch (e) {
                setAlertState({
                    isOpen: true,
                    title: '오류',
                    message: '상세 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
                    iconMode: 'warn',
                    confirmButton: {text: '확인', colorMode: true},
                    cancelButton: false,
                    onConfirm: () => hideAlert(),
                });
            } finally {
                setLoading(false);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <Box padding={{px: 16, py: 16}}>
            <div className="border border-tb-br-color rounded-[4px]">
                <div className="w-full flex">
                    <div
                        className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
                        센터
                    </div>
                    <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
                        <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                            <Input
                                value={detail.company}
                                disabled={true}
                                options={{widthSize: 'full', fixedFull: false}}
                            />
                        </div>
                    </div>
                </div>

                {/* 성함 */}
                <div className="w-full flex">
                    <div
                        className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
                        성함
                    </div>
                    <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
                        <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                            <Input
                                disabled={true}
                                value={detail.name}
                                options={{isNormal: true, noTransformed: true}}
                            />
                        </div>
                    </div>
                </div>

                {/* 아이디 */}
                <div className="w-full flex">
                    <div
                        className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
                        아이디
                    </div>
                    <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
                        <div className="w-full lg:max-w-[321px] md:max-w-[321px] flex items-center gap-[4px]">
                            <Input
                                value={detail.userId}
                                disabled={true}
                                readonly={true}
                                options={{isNormal: true, fixedFull: true, noTransformed: true}}
                            />
                        </div>
                    </div>
                </div>

                {/* 이메일 */}
                <div className="w-full flex">
                    <div
                        className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
                        이메일
                    </div>
                    <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
                        <div
                            className="w-full lg:max-w-[321px] md:max-w-[321px] flex justify-between items-center gap-[4px]">
                            <div className="w-[calc(50%-5px)]">
                                <Input
                                    value={detail.email}
                                    disabled={true}
                                    readonly={true}
                                    options={{isNormal: true, widthSize: 'full', noTransformed: true}}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 연락처 */}
                <div className="w-full flex">
                    <div
                        className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
                        연락처
                    </div>
                    <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
                        <div className="w-full lg:max-w-[321px] md:max-w-[321px] flex items-center gap-[4px]">
                            <Input
                                value={detail.tel}
                                disabled={true}
                                readonly={true}
                                options={{isNormal: true, noTransformed: true}}
                            />
                        </div>
                    </div>
                </div>

                {/* 허용 IP (콤마로 여러 개 가능) */}
                <div className="w-full flex">
                    <div
                        className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-tb-br-color">
                        허용 IP
                    </div>
                    <div className="w-full px-[8px] py-[6px] border-tb-br-color">
                        <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                            <Input
                                value={detail.ip}
                                disabled={true}
                                readonly={true}
                                options={{isNormal: true, noTransformed: true}}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end mt-[8px] gap-[8px]">
                <Btn size="sm" onClick={goList}>목록</Btn>
            </div>


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

        </Box>
    );
};

export default AdminDetail;