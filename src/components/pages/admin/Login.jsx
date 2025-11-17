import React, { useState } from 'react';
import logo from "../../../assets/img/admin_logo.svg";
import InputBox from "../../commons/InputBox.jsx";
import CheckBox from "../../commons/CheckBox.jsx";
import Button from "../../commons/Button.jsx";
import AlertBox from "../../commons/AlertBox.jsx";
const Login = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [alert, setAlert] = useState(false);

  const handleLogin = () => {
    if(id !== "" && pw !== ""){
      console.log(id, pw)
    }else{
      setAlert(true);
    }
  }

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
            <InputBox name={"pw"} validation={"비밀번호를 다시 확인해주세요."} onInput={(e) => setPw(e.target.value)} password />
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
