import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { http } from "./assets/api/commons.js";
import { AuthProvider } from "./router/AuthProvider.jsx";

import ProtectedRoute from "./router/ProtectedRoute.jsx";

import Layout from "./components/pages/admin/Layout.jsx";
import Login from "./components/pages/admin/Login.jsx";

import AdminManagement from "./components/pages/admin/admin/AdminManagement.jsx";
import AdminRegisterManagement from "./components/pages/admin/admin/AdminRegisterManagement.jsx";
import AdminDetail from "./components/pages/admin/admin/AdminDetail.jsx";

import AnswerHistoryManagement from "./components/pages/admin/history/AnswerHistoryManagement.jsx";
import ChatbotUsageStatusManagement from "./components/pages/admin/history/ChatbotUsageStatusManagement.jsx";

import DocumentManagement from "./components/pages/admin/document/DocumentManagement.jsx";
import DocumentRegister from "./components/pages/admin/document/DocumentRegister.jsx";
import DocumentDetail from "./components/pages/admin/document/DocumentDetail.jsx";
import DocumentUpdate from "./components/pages/admin/document/DocumentUpdate.jsx";

import PromptDetail from "./components/pages/admin/prompt/PromptDetail.jsx";

import ChatBot from "./components/pages/ChatBot.jsx";

const App = () => {

  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            {/* 기본 경로에서 로그인 페이지로 리다이렉트 */}
            <Route path="/" element={<Navigate to="/ksponcoadministrator/login" replace />} />

            <Route path="/main" element={<ChatBot http={http} />} />

            {/* 관리자 페이지 */}
            <Route path="/ksponcoadministrator/login" element={<Login />} />

            {/* 보호된 라우트 설정 */}
            <Route
              path="/ksponcoadministrator/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* 기본 진입 페이지 (Layout의 index) */}
              <Route index element={<DocumentManagement />} />

              {/* 문서 관리 */}
              <Route path="document" element={<DocumentManagement />} />
              <Route path="document/register" element={<DocumentRegister />} />
              <Route path="document/detail/:id" element={<DocumentDetail />} />
              <Route path="document/update/:id" element={<DocumentUpdate />} />

              {/* 관리자 관리 */}
              <Route path="adminManagement" element={<AdminManagement />} />
              <Route path="adminManagement/register" element={<AdminRegisterManagement />} />
              <Route path="adminManagement/detail/:id" element={<AdminDetail />} />

              {/* 이력 관리 */}
              <Route path="history/userQueryAnswerHistory" element={<AnswerHistoryManagement />} />
              <Route path="history/chatbotUsageStatus" element={<ChatbotUsageStatusManagement />} />

              {/* 프롬프트 관리 */}
              <Route path="prompt" element={<PromptDetail />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App;
