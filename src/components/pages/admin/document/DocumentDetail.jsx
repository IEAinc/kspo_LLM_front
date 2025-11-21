import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '../../../commons/admin/boxs/Box.jsx';
import Select from '../../../commons/admin/forms/Select.jsx';
import Input from '../../../commons/admin/forms/Input.jsx';
import Btn from '../../../commons/admin/forms/Btn.jsx';
import { API_ENDPOINT, http } from '../../../../assets/api/commons.js';

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

const DocumentDetail = ({ mode = 'detail' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isDetail = mode === 'detail';

  const [loading, setLoading] = useState(true);
  const [filePath, setFilePath] = useState(null);
  const [fileName, setFileName] = useState('');
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState(docTypeOptions[0]);
  const [useYn, setUseYn] = useState(useYnOptions[0]);
  const [created, setCreated] = useState('');
  const [createdId, setCreatedId] = useState('');
  const [updated, setUpdated] = useState('');
  const [updatedId, setUpdatedId] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await http.get(`${API_ENDPOINT.DOCS_DETAIL}/${encodeURIComponent(id)}`);
        const data = res?.data?.response || res?.data || {};
        setFilePath(data.filePath || null);
        setFileName(data.fileName || '');
        setDocName(data.title || data.fileName || '');
        const dt = docTypeOptions.find(o => o.value === data.docType) || docTypeOptions[0];
        setDocType(dt);
        const uy = useYnOptions.find(o => o.value === (data.useYn || data.useType || 'Y')) || useYnOptions[0];
        setUseYn(uy);
        setCreated(data.created || '');
        setCreatedId(data.id || '');
        setUpdated(data.updated || '');
        setUpdatedId(data.updatedId || '');
      } catch (e) {
        // eslint-disable-next-line no-alert
        alert('상세 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const ext = useMemo(() => (filePath?.split('.').pop() || '').toLowerCase(), [filePath]);
  const isPdf = ext === 'pdf';
  const isHwp = ext === 'hwp';

  const goList = () => navigate('/ksponcoadministrator/document');
  const goUpdate = () => navigate(`/ksponcoadministrator/document/update/${encodeURIComponent(id)}`);

  return (
    <div>
      <Box padding={{ px: 16, py: 16 }}>
        {/* 파일 선택 버튼: 상세/수정 화면에서는 노출하지 않음 (파일 변경 불가) */}

        {/* 폼 테이블 */}
        <div className="border border-tb-br-color rounded-[4px] overflow-hidden">
          {/* 분류명 */}
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              분류명
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                {isDetail ? (
                  <Input value={docType?.label || ''} disabled={true} options={{ widthSize: 'full', fixedFull: false }} />
                ) : (
                  <Select
                    label={undefined}
                    value={docType}
                    onChange={setDocType}
                    options={docTypeOptions}
                    uiOptions={{ widthSize: 'full', fixedFull: false }}
                  />
                )}
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
                {isDetail ? (
                  <Input value={useYn?.label || ''} disabled={true} options={{ widthSize: 'full', fixedFull: false }} />
                ) : (
                  <Select
                    label={undefined}
                    value={useYn}
                    onChange={setUseYn}
                    options={useYnOptions}
                    uiOptions={{ widthSize: 'full', fixedFull: false }}
                  />
                )}
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
                  onChange={isDetail ? undefined : (e) => setDocName(e.target.value)}
                  disabled={isDetail}
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
                <Input value={createdId} disabled={true} options={{ widthSize: 'full', fixedFull: false }} />
              </div>
            </div>
          </div>
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              등록 일시
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                <Input value={created} disabled={true} options={{ widthSize: 'full', fixedFull: false }} />
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
                <Input value={updatedId} disabled={true} options={{ widthSize: 'full', fixedFull: false }} />
              </div>
            </div>
          </div>
          <div className="w-full flex">
            <div className="min-w-[120px] flex items-center justify-center text-[14px] font-bold text-gray1 bg-tb-bg-color border-r border-b border-tb-br-color">
              최종 수정일시
            </div>
            <div className="w-full px-[8px] py-[6px] border-b border-tb-br-color">
              <div className="w-full lg:max-w-[321px] md:max-w-[321px]">
                <Input value={updated} disabled={true} options={{ widthSize: 'full', fixedFull: false }} />
              </div>
            </div>
          </div>
        </div>

        {/* 미리보기 박스 */}
        <div className="mt-[16px]">
          <div className="text-[14px] font-bold mb-[8px]">미리보기</div>
          <div className="border border-tb-br-color rounded-[4px] p-[8px] bg-white">
            {filePath ? (
              <div style={{ height: 500 }} className="w-full">
                {isPdf ? (
                  <object data={filePath} type="application/pdf" width="100%" height="100%">
                    <iframe title="pdf-preview" src={filePath} width="100%" height="100%" />
                  </object>
                ) : isHwp ? (
                  <>
                    <object data={filePath} type="application/haansoft-hwp" width="100%" height="100%">
                      <embed src={filePath} type="application/haansoft-hwp" width="100%" height="100%" />
                    </object>
                    <object data={filePath} type="application/x-hwp" width="0" height="0" style={{ display: 'none' }}>
                      <embed src={filePath} type="application/x-hwp" width="0" height="0" />
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
                미리보기 경로가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼: 상세에선 목록/수정, 수정 화면에선 목록만 */}
        <div className="mt-[16px] flex items-center justify-end gap-2">
          {isDetail ? <Btn size="sm" onClick={goUpdate}>수정</Btn> : null}
          <Btn size="sm" onClick={goList}>목록</Btn>
        </div>
      </Box>
    </div>
  );
};

export default DocumentDetail;
