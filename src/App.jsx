import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatBot from "./components/pages/ChatBot.jsx";
import Login from "./components/pages/admin/Login.jsx";
import { http } from "./assets/api/commons.js";
import Layout from "./components/pages/admin/Layout.jsx";

const App = () => {

  return (
    <>
      <Router>
        <Routes>
          {/* 기본 경로에서 다른 페이지로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/main" replace />} />

          <Route path="/main" element={<ChatBot http={http} />} />

          {/* 관리자 페이지 */}
          <Route path="/ksponcoadministrator/login" element={<Login />} />

          {/*<Route path="*" element={<NotFound />} />*/}
          <Route path="/ksponcoadministrator" element={<Layout />}>

            {/* 문서 관리 */}
            <Route path="/ksponcoadministrator/document"
                   element={<Navigate to="/ksponcoadministrator/document" replace />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App;
