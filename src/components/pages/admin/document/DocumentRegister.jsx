import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '../../../commons/admin/boxs/Box.jsx';
import Select from '../../../commons/admin/forms/Select.jsx';
import Input from '../../../commons/admin/forms/Input.jsx';
import Btn from '../../../commons/admin/forms/Btn.jsx';
import { API_ENDPOINT, http, getUserIdFromLocalStorage } from '../../../../assets/api/commons.js';

const docTypeOptions = [
  { value: 'BASE', label: '기본규정' },
  { value: 'GA', label: '총무' },
  { value: 'HRP', label: '인사' },
  { value: 'ACC', label: '회계' },
  { value: 'BIZ', label: '사업' },
  { value: 'ETC', label: '기타' },
];

const useYnOptions = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '미사용' },
];

const DocumentRegister = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileName, setFileName] = useState('');

  const [docType, setDocType] = useState(docTypeOptions[0]);
  const [useYn, setUseYn] = useState(useYnOptions[0]);
  const [docName, setDocName] = useState('');

  // 미리보기 가능한지 간단 판별 (pdf 우선)
  const ext = useMemo(() => (fileName?.split('.').pop() || '').toLowerCase(), [fileName]);
  const isPdf = ext === 'pdf';
  const isHwp = ext === 'hwp';

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    if (!['pdf', 'hwp'].includes(ext)) {
      alert('pdf 또는 hwp 파일만 선택할 수 있습니다.');
      return;
    }
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    const url = URL.createObjectURL(f);
    setFile(f);
    setFileUrl(url);
    setFileName(f.name);
    // 파일명 기본값을 문서명에 자동 반영(확장자 제거)
    if (!docName) {
      const base = f.name.replace(/\.[^.]+$/, '');
      setDocName(base);
    }
  };

  const goList = () => navigate('/ksponcoadministrator/document');

  const handleSubmit = async () => {
    if (!file) {
      alert('파일을 선택하세요.');
      return;
    }
    if (!docName?.trim()) {
      alert('문서명을 입력하세요.');
      return;
    }
    try {
      const adminId = getUserIdFromLocalStorage();
      const req = {
        adminSeq: null,
        adminId: adminId || null,
        docType: docType?.value,
        title: docName,
        useType: useYn?.value,
        ip: null,
      };
      const formData = new FormData();
      formData.append('request', new Blob([JSON.stringify(req)], { type: 'application/json' }));
      formData.append('file', file);
      await http.post(API_ENDPOINT.DOCS_CREATE, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('등록이 완료되었습니다.');
      goList();
    } catch (e) {
      console.error(e);
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <Box padding={{ px: 16, py: 16 }}>
        {/* 상단: 파일 선택 영역 (표 좌측 상단) */}
        <div className="mb-[12px] flex items-center gap-2">
          <div className="flex items-center justify-start w-full md:w-[calc(50%-10px)] lg:w-auto flex-row items-center">
            {/* 숨겨진 실제 input과 스타일된 label 버튼을 사용하여 기본 브라우저 파일 버튼과 기본 텍스트를 숨김 */}
            <div className="relative">
              <input
                  id="doc-file-input"
                  type="file"
                  accept=".pdf,.hwp"
                  onChange={onFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              />
              <label
                  htmlFor="doc-file-input"
                  className="inline-flex items-center h-[36px] px-[12px] border border-br-gray rounded-[4px] text-[14px] text-black bg-white cursor-pointer select-none"
              >
                파일 선택 (pdf, hwp)
              </label>
            </div>
          </div>
          {fileName ? (
            <span className="text-[14px] text-gray-700">{fileName}</span>
          ) : null}
        </div>

        {/* 폼 테이블 (AdminRegister 디자인과 유사한 보더 테이블) */}
        <div className="border border-tb-br-color rounded-[4px] overflow-hidden">
          {/* 분류명 */}
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              분류명
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                <Select
                  label={undefined}
                  value={docType}
                  onChange={setDocType}
                  options={docTypeOptions}
                  uiOptions={{ widthSize: 'full', fixedFull: false }}
                />
              </div>
            </div>
          </div>

          {/* 사용여부 */}
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              사용여부
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                <Select
                  label={undefined}
                  value={useYn}
                  onChange={setUseYn}
                  options={useYnOptions}
                  uiOptions={{ widthSize: 'full', fixedFull: false }}
                />
              </div>
            </div>
          </div>

          {/* 문서명 */}
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              문서명
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full lg:max-w-[500px] md:max-w-[500px]">
                <Input
                  value={docName}
                  placeholder={"예) 인사규정 (2025년 7월 24일 개정)"}
                  onChange={(e) => setDocName(e.target.value)}
                  options={{ widthSize: 'full', fixedFull: true, noTransformed: true }}
                />
              </div>
            </div>
          </div>

          {/* 등록자 / 등록 일시 */}
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              등록자
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                <Input
                  placeholder={"파일 업로드 시 자동으로 지정됩니다"}
                  disabled={true}
                  options={{ widthSize: 'full', fixedFull: false }}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              등록 일시
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                <Input
                  placeholder={"파일 업로드 시 자동으로 지정됩니다"}
                  disabled={true}
                  options={{ widthSize: 'full', fixedFull: false }}
                />
              </div>
            </div>
          </div>

          {/* 최종 수정자 / 최종 수정일시 */}
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              최종 수정자
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                <Input
                  placeholder={"파일 업로드 시 자동으로 지정됩니다"}
                  disabled={true}
                  options={{ widthSize: 'full', fixedFull: false }}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              최종 수정일시
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                <Input
                  placeholder={"파일 업로드 시 자동으로 지정됩니다"}
                  disabled={true}
                  options={{ widthSize: 'full', fixedFull: false }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 미리보기 박스 */}
        <div className="mt-[16px]">
          <div className="text-[14px] font-bold mb-[8px]">미리보기</div>
          <div className="border border-tb-br-color rounded-[4px] p-[8px] bg-white">
            {fileUrl ? (
              <div style={{ height: 500 }} className="w-full">
                {isPdf ? (
                  <object data={fileUrl} type="application/pdf" width="100%" height="100%">
                    <iframe title="pdf-preview" src={fileUrl} width="100%" height="100%" />
                  </object>
                ) : isHwp ? (
                  <>
                    <object data={fileUrl} type="application/haansoft-hwp" width="100%" height="100%">
                      <embed src={fileUrl} type="application/haansoft-hwp" width="100%" height="100%" />
                    </object>
                    {/* 일부 브라우저는 application/x-hwp MIME을 인식합니다. */}
                    <object data={fileUrl} type="application/x-hwp" width="0" height="0" style={{ display: 'none' }}>
                      <embed src={fileUrl} type="application/x-hwp" width="0" height="0" />
                    </object>
                    <noscript>
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-[14px]">
                        브라우저에서 HWP 미리보기를 지원하지 않습니다.
                      </div>
                    </noscript>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-[14px]">
                    지원하지 않는 파일 형식입니다.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ height: 274 }} className="w-full flex items-center justify-center text-gray-500 text-[14px]">
                미리보기할 파일을 선택하세요 (pdf, hwp)
              </div>
            )}
          </div>
        </div>

        {/* 우측 하단 버튼 */}
        <div className="mt-[16px] flex items-center justify-end gap-2">
          <Btn size="sm" onClick={handleSubmit}>등록</Btn>
          <Btn size="sm" onClick={goList}>목록</Btn>
        </div>
      </Box>
    </div>
  );
};

export default DocumentRegister;
