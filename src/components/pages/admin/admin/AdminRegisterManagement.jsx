import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomAlert from '../../../commons/admin/CustomAlert.jsx';
import { http, API_ENDPOINT } from '../../../../assets/api/commons.js';
import Box from '../../../commons/admin/boxs/Box.jsx';
import Btn from '../../../commons/admin/forms/Btn.jsx';
import Select from '../../../commons/admin/forms/Select.jsx';
import Input from '../../../commons/admin/forms/Input.jsx';

const scIdOptions = [
  { value: '01', label: '올림픽공원스포츠센터' },
  { value: '03', label: '분당올림픽스포츠센터' },
  { value: '05', label: '일산올림픽스포츠센터' },
  { value: '06', label: '올림픽수영장' },
  { value: '07', label: '올팍축구장' },
];

const emailDomainOptions = [
  { value: 'naver.com', label: 'naver.com' },
  { value: 'daum.net', label: 'daum.net' },
  { value: 'hanmail.net', label: 'hanmail.net' },
  { value: 'google.com', label: 'google.com' },
  { value: '', label: '직접 입력' },
];

const AdminRegisterManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode === 'update' ? 'update' : 'register';
  const userId = location.state?.userId || null; // for update

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
  const hideAlert = () => setAlertState((p) => ({ ...p, isOpen: false }));

  const [form, setForm] = useState({
    id: '',
    chkId: false,
    password: '',
    confirmPassword: '',
    name: '',
    scId: scIdOptions[0],
    company: scIdOptions[0].label,
    emailLocal: '',
    emailDomain: emailDomainOptions[0],
    tel1: '',
    tel2: '',
    tel3: '',
    ip: '', // comma-separated allowed
  });

  useEffect(() => {
    if (mode === 'update' && userId) {
      loadDetail(userId);
    } else {
      // in register mode, id is editable and needs duplication check
      setForm((f) => ({ ...f, chkId: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, userId]);

  const goBack = () => navigate('/ksponcoadministrator/adminManagement');

  const toEmailString = (local, domain) => `${(local || '').trim()}@${(domain?.value || domain || '').trim()}`;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidIPv4 = (ip) => /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(ip);
  const isValidPassword = (pw) => {
    if (!pw || pw.length < 8) return false;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasDigit = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    return [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length >= 2;
  };
  const onlyDigits = (s, max) => (s || '').replace(/\D/g, '').slice(0, max);

  const loadDetail = async (uid) => {
    try {
      const res = await http.get(`${API_ENDPOINT.ADMIN_USER_DETAIL}/${encodeURIComponent(uid)}`);
      const data = res?.data?.response || res?.data || {};
      const emailText = typeof data.email === 'string' ? data.email : (data.email?.value || data.email?.address || '');
      const [emailLocal = '', emailDom = ''] = (emailText || '').split('@');
      const telText = data.tel || data.phone || '';
      const [t1 = '', t2 = '', t3 = ''] = (telText || '').split('-');
      setForm((f) => ({
        ...f,
        id: data.id || uid,
        chkId: true, // id fixed in update
        password: '',
        confirmPassword: '',
        name: data.name || '',
        scId: scIdOptions.find(o => o.value === data.scId) || scIdOptions[0],
        company: scIdOptions.find(o => o.value === data.scId).label || scIdOptions[0].label,
        emailLocal: emailLocal,
        emailDomain: emailDomainOptions.find(o => o.value === emailDom) || emailDomainOptions[0],
        tel1: t1,
        tel2: t2,
        tel3: t3,
        ip: data.ip || '',
      }));
    } catch (e) {
      setAlertState({
        isOpen: true,
        title: '오류',
        message: '상세 정보를 불러오지 못했습니다.',
        iconMode: 'warn',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: hideAlert,
      });
    }
  };

  const checkIdDuplication = async () => {
    const user = (form.id || '').trim();
    if (!user) {
      setAlertState({ isOpen: true, title: '경고', message: '아이디를 입력하세요.', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
      return;
    }
      const res = await http.get(`${API_ENDPOINT.ADMIN_ID_CHECK}/${encodeURIComponent(user)}`);
      if (res.status === 200) {
        if (res?.data?.response) {
          // 있음 → 사용 불가
          setAlertState({ isOpen: true, title: '경고', message: '이미 사용중인 아이디입니다.', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
          setForm((f) => ({ ...f, chkId: false }));
        } else {
          // 없음 → 사용 가능
          setAlertState({ isOpen: true, title: '안내', message: '사용 가능한 아이디입니다.', iconMode: 'success', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
          setForm((f) => ({ ...f, chkId: true }));
        }
      } else {
        setAlertState({ isOpen: true, title: '오류', message: '아이디 확인 중 오류가 발생했습니다.', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
      }
  };

  const validateAndSubmit = async () => {
    // Required fields
    if (!form.scId?.value) {
      setAlertState({ isOpen: true, title: '경고', message: '센터를 선택하세요.', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
      return;
    }
    if (!form.name?.trim()) {
      setAlertState({ isOpen: true, title: '경고', message: '성함을 입력하세요.', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
      return;
    }
    if (mode === 'register') {
      if (!form.id?.trim()) {
        setAlertState({ isOpen: true, title: '경고', message: '아이디를 입력하세요.', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
        return;
      }
      if (!form.chkId) {
        setAlertState({ isOpen: true, title: '경고', message: '아이디 중복 확인을 해주세요.', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
        return;
      }
      if (!isValidPassword(form.password)) {
        setAlertState({ isOpen: true, title: '경고', message: '비밀번호 규칙을 확인하세요. (8자 이상, 대소문자/숫자/특수문자 중 2종 이상)', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
        return;
      }
      if (form.password !== form.confirmPassword) {
        setAlertState({ isOpen: true, title: '경고', message: '비밀번호가 일치하지 않습니다.', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
        return;
      }
    } else if (mode === 'update') {
      if (form.password) {
        if (!isValidPassword(form.password)) {
          setAlertState({ isOpen: true, title: '경고', message: '비밀번호 규칙을 확인하세요.', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
          return;
        }
        if (form.password !== form.confirmPassword) {
          setAlertState({ isOpen: true, title: '경고', message: '비밀번호가 일치하지 않습니다.', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
          return;
        }
      }
    }

    const email = toEmailString(form.emailLocal, form.emailDomain);
    if (!isValidEmail(email)) {
      setAlertState({ isOpen: true, title: '경고', message: '유효한 이메일을 입력하세요.', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
      return;
    }
    if (!form.tel1 || !form.tel2 || !form.tel3) {
      setAlertState({ isOpen: true, title: '경고', message: '연락처를 정확히 입력하세요.', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
      return;
    }

    // IPs: allow comma separated
    const ips = (form.ip || '').split(',').map(s => s.trim()).filter(Boolean);
    if (ips.length === 0) {
      setAlertState({ isOpen: true, title: '경고', message: '허용 IP를 입력하세요. 여러 개는 콤마(,)로 구분합니다.', iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
      return;
    }
    for (const ip of ips) {
      if (!isValidIPv4(ip)) {
        setAlertState({ isOpen: true, title: '경고', message: `잘못된 IP 형식: ${ip}`, iconMode: 'warn', confirmButton: { text: '확인', colorMode: true }, cancelButton: false, onConfirm: hideAlert });
        return;
      }
    }

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      scId: form.scId.value,
      company: (form.company || '').trim(),
      email,
      tel: `${form.tel1}-${form.tel2}-${form.tel3}`,
      ip: ips.join(','),
    };
    if (form.password) payload.password = form.password;

    try {
      if (mode === 'register') {
        await http.post(API_ENDPOINT.ADMIN_USER_INSERT, payload);
      } else {
        await http.put(API_ENDPOINT.ADMIN_USER_UPDATE, payload);
      }
      setAlertState({
        isOpen: true,
        title: mode === 'register' ? '등록 완료' : '수정 완료',
        message: mode === 'register' ? '새로운 관리자 계정이 등록되었습니다.' : '관리자 계정 정보가 수정되었습니다.',
        iconMode: 'success',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: () => navigate('/ksponcoadministrator/adminManagement'),
      });
    } catch (e) {
      setAlertState({
        isOpen: true,
        title: '오류',
        message: '저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        iconMode: 'warn',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: hideAlert,
      });
    }
  };

  return (
    <Box padding={{ px: 16, py: 16 }}>
      <div className="border border-tb-br-color rounded-[4px]">
        {/* 센터 SC_ID */}
        <div className="w-full flex">
          <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
            센터<span className="text-point-color">*</span>
          </div>
          <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
            <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
              <Select
                value={form.scId}
                options={scIdOptions}
                onChange={(opt) => setForm((f) => ({ ...f, scId: opt }))}
                uiOptions={{ widthSize: 'full', noTransformed: true }}
              />
            </div>
          </div>
        </div>

        {/* 성함 */}
        <div className="w-full flex">
          <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
            성함<span className="text-point-color">*</span>
          </div>
          <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
            <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
              <Input
                value={form.name}
                onInput={(e) => setForm((f) => ({ ...f, name: e.target.value.replaceAll(' ', '') }))}
                options={{ isNormal: true, noTransformed: true }}
              />
            </div>
          </div>
        </div>

        {/* 아이디 */}
        <div className="w-full flex">
          <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
            아이디<span className="text-point-color">*</span>
          </div>
          <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
            <div className="w-full lg:max-w-[321px] md:max-w-[321px] flex items-center gap-[4px]">
              <Input
                value={form.id}
                readonly={mode === 'update'}
                onInput={(e) => setForm((f) => ({ ...f, id: e.target.value.replaceAll(' ', ''), chkId: false }))}
                options={{ isNormal: true, fixedFull: true, noTransformed: true }}
              />
              {mode === 'register' && (
                <Btn size="sm" colorMode={true} minWidth="78px" onClick={checkIdDuplication}>중복확인</Btn>
              )}
            </div>
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="w-full flex">
          <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
            비밀번호{mode === 'register' && <span className="text-point-color">*</span>}
          </div>
          <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
            <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
              <Input
                type="password"
                value={form.password}
                onInput={(e) => setForm((f) => ({ ...f, password: e.target.value.replaceAll(' ', '') }))}
                options={{ isNormal: true, noTransformed: true }}
              />
            </div>
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="w-full flex">
          <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
            비밀번호 확인{mode === 'register' && <span className="text-point-color">*</span>}
          </div>
          <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
            <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
              <Input
                type="password"
                value={form.confirmPassword}
                onInput={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value.replaceAll(' ', '') }))}
                options={{ isNormal: true, noTransformed: true }}
              />
            </div>
          </div>
        </div>

        {/* 이메일 */}
        <div className="w-full flex">
          <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
            이메일<span className="text-point-color">*</span>
          </div>
          <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
            <div className="w-full lg:max-w-[321px] md:max-w-[321px] flex justify-between items-center gap-[4px]">
              <div className="w-[calc(50%-5px)]">
                <Input
                  value={form.emailLocal}
                  onInput={(e) => setForm((f) => ({ ...f, emailLocal: e.target.value.replaceAll(' ', '') }))}
                  options={{ isNormal: true, widthSize: 'full', noTransformed: true }}
                />
              </div>
              <span className="inline-block">@</span>
              { form.emailDomain.value === '' ?
                  <div className="w-[calc(50%-5px)]">
                      <Input
                          value={form.emailDomain.value}
                          onInput={(e) => setForm((f) => ({ ...f, emailDomain: { value: e.target.value, label: e.target.value } }))}
                          options={{ isNormal: true, widthSize: 'full', noTransformed: true }}
                      />
                  </div>
                    : null
              }
              <div className="w-[calc(50%-5px)]">
                <Select
                    value={form.emailDomain}
                    options={emailDomainOptions}
                    onChange={(opt) => setForm((f) => ({ ...f, emailDomain: opt }))}
                    uiOptions={{ widthSize: 'full', noTransformed: true }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 연락처 */}
        <div className="w-full flex">
          <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
            연락처<span className="text-point-color">*</span>
          </div>
          <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
            <div className="w-full lg:max-w-[321px] md:max-w-[321px] flex items-center gap-[4px]">
              <Input
                value={form.tel1}
                onInput={(e) => setForm((f) => ({ ...f, tel1: onlyDigits(e.target.value, 3) }))}
                options={{ isNormal: true, noTransformed: true }}
              />
              -
              <Input
                value={form.tel2}
                onInput={(e) => setForm((f) => ({ ...f, tel2: onlyDigits(e.target.value, 4) }))}
                options={{ isNormal: true, noTransformed: true }}
              />
              -
              <Input
                value={form.tel3}
                onInput={(e) => setForm((f) => ({ ...f, tel3: onlyDigits(e.target.value, 4) }))}
                options={{ isNormal: true, noTransformed: true }}
              />
            </div>
          </div>
        </div>

        {/* 허용 IP (콤마로 여러 개 가능) */}
        <div className="w-full flex">
          <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-tb-br-color">
            허용 IP<span className="text-point-color">*</span>
          </div>
          <div className="w-full px-[8px] py-[6px] border-tb-br-color">
            <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
              <Input
                value={form.ip}
                placeholder="여러 개는 콤마(,)로 구분"
                onInput={(e) => setForm((f) => ({ ...f, ip: e.target.value }))}
                options={{ isNormal: true, noTransformed: true }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end mt-[8px] gap-[8px]">
        <Btn size="sm" minWidth="80px" onClick={goBack}>목록</Btn>
        <Btn size="sm" minWidth="80px" colorMode={true} onClick={validateAndSubmit}>
          {mode === 'register' ? '등록' : '수정 완료'}
        </Btn>
      </div>

      <CustomAlert
        title={alertState.title}
        iconMode={alertState.iconMode}
        message={alertState.message}
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        confirmButton={alertState.confirmButton}
        cancelButton={alertState.cancelButton}
        onConfirm={alertState.onConfirm}
        onCancel={alertState.onCancel}
      />
    </Box>
  );
};

export default AdminRegisterManagement;