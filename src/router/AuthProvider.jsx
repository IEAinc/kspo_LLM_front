import { createContext, useContext, useEffect, useState } from "react";
import { userApi } from "../assets/api/userApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authorized, setAuthorized] = useState(null); // null = 검사중

  async function validate() {
    const id = localStorage.getItem("userId");

    if (!id) {
      setAuthorized(false);
      return;
    }

    try {
      const res = await userApi.validateToken();
      if (res.status === 200) {
        setAuthorized(true);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  }

  const logout = () => {
    // 클라이언트의 상태를 먼저 변경
    localStorage.clear();
    setAuthorized(false);

    // 백그라운드에서 서버에 로그아웃 요청 (응답을 기다리지 않음)
    userApi.logout().catch(error => console.error("Server logout failed:", error));
  };

  useEffect(() => {
    validate();
  }, []);

  return (
    <AuthContext.Provider value={{ authorized, setAuthorized, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
