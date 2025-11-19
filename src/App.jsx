import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatBot from "./components/pages/ChatBot.jsx";
import Login from "./components/pages/admin/Login.jsx";
import { http } from "./assets/api/commons.js";

const App = () => {

  return (
    <>
      <Router>
        <Routes>
          {/* 기본 경로에서 다른 페이지로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/main" replace />} />

          <Route path="/main" element={<ChatBot http={http} />} />

          {/* 관리자 페이지 */}
          <Route path="/ksponcoadministrator" element={<Login />} />


          {/*<Route path="*" element={<NotFound />} />*/}
        </Routes>
      </Router>
    </>
  )
}

export default App;
