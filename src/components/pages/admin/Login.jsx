import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../router/AuthProvider.jsx";
import { userApi } from "../../../assets/api/userApi.js";

import InputBox from "../../commons/InputBox.jsx";
import CheckBox from "../../commons/CheckBox.jsx";
import Button from "../../commons/Button.jsx";
import AlertBox from "../../commons/AlertBox.jsx";

import logo from "../../../assets/img/admin_logo.svg";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthorized } = useAuth();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [alert, setAlert] = useState(false);

  const handleLogin = () => {
    userApi.login({ id, password: pw })
      .then(async (response) => {
        if (response.status === 200) {
          const v = await userApi.validateToken(); // 로그인 시 유저정보 저장
          if (v.status === 200) {
            localStorage.setItem("userId", v.data.id);
            localStorage.setItem("userName", v.data.name);
            setAuthorized(true); // 전역 인증 상태를 true로 변경

            navigate("/ksponcoadministrator/document", {
              replace: true,
            });
          }
        }
      })
      .catch(() => setAlert(true));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <div className="login-box">
        <div className="login-form">
          <div className="top">
            <img src={`${logo}`} alt="" />
            <h2>통합 관리자 로그인</h2>
          </div>
          <div className="form">
            <InputBox name={"id"} validation={"아이디를 다시 확인해주세요."} onInput={(e) => setId(e.target.value)} />
            <InputBox name={"pw"} validation={"비밀번호를 다시 확인해주세요."} onInput={(e) => setPw(e.target.value)} onKeyDown={handleKeyDown}
              password />
            <CheckBox name={"id_save"} text={"아이디 저장하기"} />
            <Button className={"primary large"} text={"로그인"} contained onClick={handleLogin} />
          </div>
        </div>
      </div>

      <AlertBox
        status={alert}
        setStatus={setAlert}
        type={"warning"}
        text={"아이디 또는 비밀번호가 잘못되었습니다.\n확인 버튼을 눌러 다시 입력하세요."}
      />
    </>
  )
}

export default Login;
