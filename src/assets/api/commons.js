import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:8080/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export const getUserNameFromLocalStorage = () => {
    const token = localStorage.getItem('userName');
    return token || null;
}

export const getUserIdFromLocalStorage = () => {
    const token = localStorage.getItem('userId');
    return token || null;
}

// 랜덤 문구 생성기
export const generateRandomString = () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const hour = String(new Date().getHours()).padStart(2, '0');
  const minute = String(new Date().getMinutes()).padStart(2, '0');
  const second = String(new Date().getSeconds()).padStart(2, '0');
  const date = `${year}${month}${day}${hour}${minute}${second}`;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = `${date}-`;
  for (let i = 0; i < 30; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const API_ENDPOINT = {
  CHAT_QUERY: "/chat/query",
  LOGIN: "/admin/login",
  LOGOUT: "/admin/logout",
  DOCS_PAGE: "/admin/docs",
  DOCS_CREATE: "/admin/docs/regulation-docs",
  DOCS_DELETE: "/admin/docs/delete",
  DOCS_DETAIL: "/admin/docs", // usage: `${DOCS_DETAIL}/${regulationDocsSeq}`
  ADMIN_USER_PAGE: "/admin/user",
  ADMIN_USER_INSERT: "/admin/user/insert",
  ADMIN_USER_UPDATE: "/admin/user/update",
  ADMIN_USER_DELETE: "/admin/user/delete",
  ADMIN_USER_DETAIL: "/admin/user", // usage: `${ADMIN_USER_DETAIL}/${userId}`
  ADMIN_ID_CHECK: "/admin/user/idCheck",
  ANSWER_HISTORY: "/admin/history",
  HISTORY_USAGE: "/admin/history/usage",
  HISTORY_TOTAL_USAGE: "/admin/history/total/usage",
  VALIDATE_TOKEN: "/admin/validateToken",
  LIKE: "/evaluation",
  ALL_ROOM: "/room/all",
};