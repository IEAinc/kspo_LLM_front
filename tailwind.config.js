/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* fontfamily */
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'], // Pretendard 폰트 지정
      },
      colors: {
        'primary-color': '#101924',
        'primary-color-light': '#242C36',
        'primary-blue': '#2D72E2',
        'primary-blue-light': '#F5F6FA',
        'primary-blue-dark': '#076DC5',
        'light-blue': '#77A5F4',
        'soft-blue': '#A4C7F9',
        'white': '#ffffff',
        'black': '#333333',
        'gray1': '#666666',
        'gray2': '#BABABA',
        'gray3': '#888888',
        'br-gray':'#DBDBDB',
        'br-gray2':'#bdbdbd',
        'br-gray3':'#D8DCE2',
        'tb-br-color':'#E4E4E4',
        'tb-bg-color': '#F5F5F5',
        'point-color': '#C65B5B'
      },
      /* 너비 */
      screens: {
        sm: '768px',
        md: '1200px', // 기본 md(768px) 재정의
        lg: '1500px', // 기본 lg(1024px) 재정의
        xl: '1700px',
      },
    },
  },
  plugins: [],
}

