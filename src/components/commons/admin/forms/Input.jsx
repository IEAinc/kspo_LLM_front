import { useEffect, useId, useState } from 'react';

const Input = ({
                 id,
                 labelName,
                 type = 'text',
                 placeholder,
                 disabled = false,
                 readonly = false,
                 required = false,
                 value,
                 name,
                 error,
                 onChange,
                 onInput,
                 onKeyDown,
                 options = {}
               }) => {
  // 고유 ID 생성
  const generatedId = useId();
  const inputId = id || generatedId; // 아이디를 지정하고 싶을 경우

  // 1. 옵션 값 추출
  const {
    isColumn = false,
    isNormal = true,
    widthSize = 'full', // widthSize 추가 (기본값은 full)
    labelSize = 'full',
    fixedFull = false,
    noTransformed = false
  } = options;

  // 2. widthSize에 따라 Tailwind CSS 스타일 매핑
  // [인풋 사이즈]
  const widthClassMap = {
    lg: 'lg:w-[300px]', // Large
    md2: 'lg:w-[270] w-full', // Large
    md: 'lg:w-[200px]', // Medium
    sm: 'lg:w-[150px]', // Small
    full: 'w-full' // Full Width
  };
  const widthClass = widthClassMap[widthSize] || 'w-full'; // 기본값은 full

  // [라벨 사이즈]
  const labelClassMap = {
    lg: 'min-w-[74px]', // Large
    md2: 'min-w-[74px]', // Large
    md: 'min-w-[62px]', // Medium
    sm: 'min-w-[50px]', // Small
    full: 'w-full' // Full Width
  };
  const labelClass = labelClassMap[labelSize] || 'sm'; // 기본값은 full
  const [disable,setDisable] =useState(disabled);
  useEffect(()=>{
    setDisable(disabled)
  },[disabled])
  // 3. 컴포넌트 렌더링
  return (
    <div
      className={`
        flex
        items-center
        justify-start
        w-full
        ${noTransformed && widthSize === 'full' ? 'md:w-full lg:w-full' : 'md:w-[calc(50%-10px)]'}
        ${fixedFull ? 'lg:w-full' : (labelName && widthSize === 'full' ? 'lg:w-full' : 'lg:w-auto')}
        ${isColumn ? 'flex-col gap-[6px]' : 'flex-row items-center'}
      `}
    >
      {/* Label과 Input 연결 */}
      {labelName && (
        <label
          htmlFor={inputId}
          className={`
          ${isColumn ? 'text-[12px] text-gray3 font-medium text-left' : 'text-[14px] text-black font-bold text-left'}
          ${labelClass}
        `}
        >
          {labelName}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onInput={onInput}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readonly}
        required={required}
        className={`
          ${labelName && isNormal ? 'h-[40px]' : 'h-[36px]'}
          p-[10px]
          border
          border-br-gray
          rounded-[4px]
          ${error ? 'border-red-500' : 'border-br-gray'}
          text-black
          font-regular
          text-[14px]
          ${widthClass}
          ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
          focus:outline-none focus:ring-1 
          border-solid
        `}
      />
      {error && <span className="block w-full text-red-500 text-[12px] text-left mt-1">{error}</span>}
    </div>
  );
};

export default Input;
