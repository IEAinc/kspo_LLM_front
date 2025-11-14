import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatBot from "./components/pages/ChatBot.jsx";

const App = () => {

  return (
    <>
      <Router>
        <Routes>
          {/* 기본 경로에서 다른 페이지로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/main" replace />} />

          <Route path="/main" element={<ChatBot />} />

          {/*<Route path="*" element={<NotFound />} />*/}
        </Routes>
      </Router>
    </>
  )
}

export default App;
