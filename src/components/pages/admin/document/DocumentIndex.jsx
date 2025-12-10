import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '../../../commons/admin/boxs/Box.jsx';
import { http } from '../../../../assets/api/commons.js';
import CustomAlert from '../../../commons/admin/CustomAlert.jsx';
import Input from "../../../commons/admin/forms/Input.jsx";

// Helper: merge documents (texts) with metadatas to produce chunk payloads
const buildChunksFromResponse = (documents = [], metadatas = []) => {
  const max = Math.max(documents.length, metadatas.length);
  const chunks = [];
  for (let i = 0; i < max; i++) {
    const meta = metadatas[i] || {};
    const text = (documents[i] || meta.text || '').trim();
    if (!text) continue; // skip empty texts
    chunks.push({
      text,
      chapter: meta.chapter ?? '',
      section: meta.section ?? '',
      article: meta.article ?? '',
      clause: meta.clause ?? '',
      page: meta.page ?? undefined,
    });
  }
  return chunks;
};

const DocumentIndex = () => {
  const { fileName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filePath, setFilePath] = useState('');
  const [metadatas, setMetadatas] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', iconMode: 'warn', confirmButton: false, cancelButton: false });
  const [error, setError] = useState(null);

  // loadData: 독립적으로 재사용 가능하게 분리
  const loadData = async () => {
    if (!fileName) return;
    setLoading(true);
    setError(null);
    try {
      const res = await http.get('/admin/chat/manual-index', { params: { fileName } });
      const body = res?.data?.response?.results || res?.data?.response || {};
      const list = Array.isArray(body.metadatas) ? body.metadatas : [];
      const docs = Array.isArray(body.documents) ? body.documents : [];
      setMetadatas(list);
      setDocuments(docs);
      setFilePath((list[0] && list[0].filePath) || '');
      if (chunks.length === 0) {
        const initialChunks = buildChunksFromResponse(docs, list);
        setChunks(initialChunks);
      }
    } catch (e) {
      setError('문서 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileName]);

  const goDetail = (index) => {
    navigate(`/ksponcoadministrator/document/detail/${encodeURIComponent(String(index))}`);
  };

  const hideAlert = () => setAlertState((p) => ({ ...p, isOpen: false }));

  const addChunk = () => {
    setChunks((prev) => [{ text: '', chapter: '', section: '', article: '', clause: '', page: undefined }, ...prev]);
  };

  const updateChunk = (idx, key, value) => {
    setChunks((prev) => prev.map((c, i) => (i === idx ? { ...c, [key]: value } : c)));
  };

  const deleteChunk = (idx) => {
    setChunks((prev) => prev.filter((_, i) => i !== idx));
  };

  const sendManualIndex = async () => {
    if (!fileName) {
      setAlertState({ isOpen: true, title: '오류', message: '파일명이 없습니다.', iconMode: 'warn', confirmButton: { text: '확인' } });
      return;
    }

    const payloadChunks = chunks.map((c) => ({ ...c }));
    if (!Array.isArray(payloadChunks) || payloadChunks.length === 0) {
      setAlertState({ isOpen: true, title: '오류', message: '전송할 청크가 없습니다.', iconMode: 'warn', confirmButton: { text: '확인' } });
      return;
    }
    const invalid = payloadChunks.find((c) => !c.text || String(c.text).trim() === '');
    if (invalid) {
      setAlertState({ isOpen: true, title: '오류', message: '청크의 text는 비어있을 수 없습니다.', iconMode: 'warn', confirmButton: { text: '확인' } });
      return;
    }

    const payload = {
      source: fileName,
      useYn: 'Y',
      filePath,
      page: undefined,
      chunks: payloadChunks,
    };

    try {
      setLoading(true);
      const res = await http.post('/admin/chat/manual-index', payload);
      setAlertState({ isOpen: true, title: '완료', message: '수동 색인 요청이 전송되었습니다.', iconMode: 'complete', confirmButton: { text: '확인' } });
      // 전송 성공 시 자동 새로고침: 서버의 최신 메타데이터/문서 상태를 다시 로드
      await loadData();
    } catch (e) {
      setAlertState({ isOpen: true, title: '오류', message: '수동 색인 요청 전송 중 오류가 발생했습니다.', iconMode: 'warn', confirmButton: { text: '확인' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Box padding={{ px: 16, py: 16 }}>
        <div className="flex items-center justify-between mb-[8px]">
          <div className="text-[14px] font-bold">문서 인덱스: {fileName}</div>
          <div className="flex items-center gap-2">
            <button type="button" className="px-2 py-1 bg-green-500 text-white rounded" onClick={addChunk}>+ 추가</button>
            <button type="button" className="px-2 py-1 bg-blue-600 text-white rounded" onClick={sendManualIndex}>색인 전송</button>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-[8px]">
            <Input value={filePath} onChange={(e) => setFilePath(e.target.value)} options={{isNormal: true, noTransformed: true}}/>
        </div>

        <div className="border border-tb-br-color rounded-[4px] p-[8px] bg-white">
          {loading ? (
            <div className="w-full h-[200px] flex items-center justify-center">로딩중...</div>
          ) : error ? (
            <div className="w-full h-[200px] flex items-center justify-center text-red-600">{error}</div>
          ) : ( (chunks && chunks.length > 0) || metadatas.length > 0 ) ? (
            <div className="w-full">
              {(chunks || []).map((m, idx) => (
                <div key={idx} className="mb-4 p-3 border rounded bg-gray-50">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex-1 flex gap-2">
                      <Input value={m.chapter} placeholder={"ex) 제1장"}  onChange={(e) => updateChunk(idx, 'chapter', e.target.value)} options={{isNormal: true, noTransformed: true}}/>
                      <Input value={m.section} placeholder={"ex) 제1절"}  onChange={(e) => updateChunk(idx, 'section', e.target.value)} options={{isNormal: true, noTransformed: true}}/>
                      <Input value={m.article} placeholder={"ex) 제1조"}  onChange={(e) => updateChunk(idx, 'article', e.target.value)} options={{isNormal: true, noTransformed: true}}/>
                      <Input value={m.clause}  placeholder={"ex) 제1항"}  onChange={(e) => updateChunk(idx, 'clause', e.target.value)} options={{isNormal: true, noTransformed: true}}/>
                      <Input value={m.page}    placeholder={"페이지 번호"} onChange={(e) => updateChunk(idx, 'page', e.target.value)} options={{isNormal: true, noTransformed: true}}/>
                    </div>
                    <div className="flex-shrink-0 ml-2 flex items-center gap-2">
                      <button type="button" className="px-2 py-1 bg-red-500 text-white rounded text-[12px]" onClick={() => deleteChunk(idx)}>삭제</button>
                    </div>
                  </div>
                  <textarea
                    value={m.text}
                    onChange={(e) => updateChunk(idx, 'text', e.target.value)}
                    className="w-full p-2 text-[13px] text-gray-800 border rounded"
                    rows={3}
                    style={{ whiteSpace: 'pre-wrap' }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-[200px] flex items-center justify-center text-gray-500">메타데이터가 없습니다.</div>
          )}
        </div>
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

export default DocumentIndex;
