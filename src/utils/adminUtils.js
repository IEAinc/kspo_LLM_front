import { useCallback } from 'react';

// 날짜 포맷 유틸리티
export const formatDate = (value, format = 'yyyy-MM-dd') => {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  if (format === 'MM/dd') {
    return `${m}/${d}`;
  }
  return `${y}-${m}-${d}`;
};

// AG Grid용 날짜 포맷터
export const createDateFormatter = (format = 'yyyy-MM-dd') => (params) => {
  return formatDate(params.value, format);
};

// NO 컬럼 valueGetter 생성
export const createNoColumnValueGetter = () => (params) => {
  const rowIndex = params.node.rowIndex;
  const { currentPage = 1, pageSize = 10 } = params?.context || {};
  return (currentPage - 1) * pageSize + rowIndex + 1;
};

// 이메일 파싱
export const parseEmail = (emailObjOrStr) => {
  if (!emailObjOrStr) return '';
  if (typeof emailObjOrStr === 'string') return emailObjOrStr;
  return emailObjOrStr.value || emailObjOrStr.address || '';
};

// 전화번호 파싱 (xxx-xxxx-xxxx)
export const parsePhone = (phone) => {
  if (!phone) return ['', '', ''];
  return phone.split('-');
};

// 전화번호 포맷 (배열 → 문자열)
export const formatPhone = (parts) => parts.filter(Boolean).join('-');

// IP 검증
export const isValidIPv4 = (ip) => {
  return /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(ip);
};

// 이메일 검증
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 비밀번호 검증 (8자 이상, 대소문자/숫자/특수문자 중 2종 이상)
export const isValidPassword = (pw) => {
  if (!pw || pw.length < 8) return false;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  return [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length >= 2;
};

// 숫자만 추출
export const onlyDigits = (str, maxLength) => {
  const digits = (str || '').replace(/\D/g, '');
  return maxLength ? digits.slice(0, maxLength) : digits;
};

export default {
  formatDate,
  createDateFormatter,
  createNoColumnValueGetter,
  parseEmail,
  parsePhone,
  formatPhone,
  isValidIPv4,
  isValidEmail,
  isValidPassword,
  onlyDigits,
};

