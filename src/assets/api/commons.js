import axios from "axios";

export const http = axios.create(
  {
    baseURL: "http://localhost:8080/",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      // "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  }
);

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