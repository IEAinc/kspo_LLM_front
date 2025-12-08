import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '../../../commons/admin/boxs/Box.jsx';
import Input from '../../../commons/admin/forms/Input.jsx';
import Select from '../../../commons/admin/forms/Select.jsx';
import Btn from '../../../commons/admin/forms/Btn.jsx';
import CustomAlert from '../../../commons/admin/CustomAlert.jsx';
import { http, API_ENDPOINT } from '../../../../assets/api/commons.js';

const useYnOptions = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '미사용' },
];

const PromptDetail = () => {
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState('create'); // create | update
  const location = useLocation();
  const isDefault = location?.pathname?.endsWith('/prompt/default');

  const [promptSeq, setPromptSeq] = useState(null);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [topK, setTopK] = useState('');
  const [useYn, setUseYn] = useState(useYnOptions[0]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await http.get(API_ENDPOINT.PROMPT, {
          params: isDefault ? { scId: 'KS' } : undefined,
        });
        const data = res?.data?.response ?? res?.data ?? null;
        if (data) {
          setPromptSeq(data.promptSeq ?? null);
          setSystemPrompt(data.systemPrompt ?? '');
          setUserPrompt(data.userPrompt ?? '');
          setTopK(data.topK ?? '');
          const uy = useYnOptions.find((o) => o.value === (data.useYn || 'Y')) || useYnOptions[0];
          setUseYn(uy);
          setMode(data.promptSeq ? 'update' : 'create');
        } else {
          setPromptSeq(null);
          setSystemPrompt('');
          setUserPrompt('');
          setTopK('');
          setUseYn(useYnOptions[0]);
          setMode('create');
        }
      } catch (e) {
        setAlertState({
          isOpen: true,
          title: '오류',
          message: '프롬프트 정보를 불러오지 못했습니다.',
          iconMode: 'warn',
          confirmButton: { text: '확인', colorMode: true },
          cancelButton: false,
          onConfirm: () => hideAlert(),
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isDefault]);

  const goList = () => navigate('/ksponcoadministrator/promptManagement');

  const validateAndSubmit = async () => {
    if (submitting) return;
    // 간단 검증
    if (!systemPrompt.trim() && !userPrompt.trim()) {
      setAlertState({
        isOpen: true,
        title: '확인',
        message: '시스템 프롬프트 또는 유저 프롬프트 중 하나 이상 입력하세요.',
        iconMode: 'warn',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: () => hideAlert(),
      });
      return;
    }
    if (topK !== '' && Number.isNaN(Number(topK))) {
      setAlertState({
        isOpen: true,
        title: '확인',
        message: '상위 K개(topK)는 숫자로 입력하세요.',
        iconMode: 'warn',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: () => hideAlert(),
      });
      return;
    }

    const payload = {
      systemPrompt: systemPrompt || null,
      userPrompt: userPrompt || null,
      topK: topK === '' ? null : Number(topK),
      useYn: useYn?.value || 'Y',
      ...(isDefault ? { scId: 'KS' } : {}),
    };

    try {
      setSubmitting(true);
      if (mode === 'create') {
        await http.post(API_ENDPOINT.PROMPT, payload);
      } else {
        payload.promptSeq = promptSeq;
        await http.put(API_ENDPOINT.PROMPT, payload);
      }
      setAlertState({
        isOpen: true,
        title: mode === 'create' ? '등록 완료' : '수정 완료',
        message: mode === 'create' ? '프롬프트가 등록되었습니다.' : '프롬프트가 수정되었습니다.',
        iconMode: 'success',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: async () => {
          hideAlert();
          // 최신 데이터 다시 조회
          setLoading(true);
          try {
            const res = await http.get(API_ENDPOINT.PROMPT, {
              params: isDefault ? { scId: 'KS' } : undefined,
            });
            const data = res?.data?.response ?? res?.data ?? null;
            if (data) {
              setPromptSeq(data.promptSeq ?? null);
              setSystemPrompt(data.systemPrompt ?? '');
              setUserPrompt(data.userPrompt ?? '');
              setTopK(data.topK ?? '');
              const uy = useYnOptions.find((o) => o.value === (data.useYn || 'Y')) || useYnOptions[0];
              setUseYn(uy);
              setMode(data.promptSeq ? 'update' : 'create');
            } else {
              setPromptSeq(null);
              setSystemPrompt('');
              setUserPrompt('');
              setTopK('');
              setUseYn(useYnOptions[0]);
              setMode('create');
            }
          } finally {
            setLoading(false);
          }
        },
      });
    } catch (e) {
      setAlertState({
        isOpen: true,
        title: '오류',
        message: '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        iconMode: 'warn',
        confirmButton: { text: '확인', colorMode: true },
        cancelButton: false,
        onConfirm: () => hideAlert(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box padding={{ px: 16, py: 16 }}>
      <div className="border border-tb-br-color rounded-[4px]">
        {/* 시스템 프롬프트 */}
        <div className="w-full flex">
          <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
            시스템 프롬프트
          </div>
          <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
            <div className="w-full">
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="시스템 프롬프트를 입력하세요"
                rows={6}
                className="w-full p-[10px] border border-br-gray rounded-[4px] text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 유저 프롬프트 */}
        <div className="w-full flex">
          <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
            유저 프롬프트
          </div>
          <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
            <div className="w-full">
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="유저 프롬프트를 입력하세요"
                rows={6}
                className="w-full p-[10px] border border-br-gray rounded-[4px] text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 상위 K개 선택 */}
        <div className="w-full flex">
          <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
            상위 K개 선택
          </div>
          <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
            <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
              <Input
                type="number"
                value={topK}
                onChange={(e) => setTopK(e.target.value)}
                options={{ isNormal: true, noTransformed: true }}
              />
            </div>
          </div>
        </div>

        {/* 사용 여부 */}
        <div className="w-full flex">
          <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
            사용여부
          </div>
          <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
            <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
              <Select value={useYn} onChange={setUseYn} options={useYnOptions} uiOptions={{ widthSize: 'full' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end mt-[8px] gap-[8px]">
        <Btn size="sm" minWidth="80px" colorMode={true} onClick={validateAndSubmit} disabled={submitting}>
          {mode === 'create' ? '등록' : '수정'}
        </Btn>
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

export default PromptDetail;