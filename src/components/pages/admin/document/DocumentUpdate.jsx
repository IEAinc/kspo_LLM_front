import React from 'react';
import DocumentDetail from './DocumentDetail.jsx';

// 업데이트 화면: 파일 변경 버튼 없이 상세 데이터로 필드만 편집 가능
const DocumentUpdate = () => {
  return <DocumentDetail mode="update" />;
};

export default DocumentUpdate;
