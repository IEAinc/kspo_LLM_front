
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'

import { getUserNameFromLocalStorage } from '../../../assets/api/commons.js';
import { useAuth } from '../../../router/AuthProvider.jsx';
import UserIcon from '../../../assets/img/icon/userImage.svg'

const AdminHeader = () => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth(); // AuthProvider에서 logout 함수 가져오기
  const [username, setUsername] = useState('');

  useEffect(() => {
    const name = getUserNameFromLocalStorage();
    if (name) setUsername(name);
  }, []);

  const handleLogout = () => {
    authLogout();
    navigate('/ksponcoadministrator/login');
  };

  return (
    <header className="w-[calc(100%-220px)] h-[48px] flex items-center fixed top-0 left-[220px] py-[15px] px-[24px] border-b border-br-gray bg-white z-10">
      <div className="w-full flex items-center justify-end gap-[28px]">
        <p className="flex items-center gap-[4px] text-[16px] text-gray font-medium">
          <img src={`${UserIcon}`} alt="" />
          {username}님 접속 중
        </p>
        <ul className="flex items-center">
          <li>
            <button type="button" className="text-[16px] text-gray font-medium" onClick={handleLogout}>로그아웃</button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default AdminHeader;
