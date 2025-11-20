import { useEffect, useRef, useState } from 'react';

const ChevronDown = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    width="16"
    height="16"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const Select = ({ label, size = 'sm', value, onChange, options = [], openDirection = 'bottom', uiOptions = {} }) => {
  const {
    widthSize = 'full',
    labelSize = 'full',
    fixedFull = false,
    noTransformed = false,
  } = uiOptions;

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // 1. 사이즈
  const sizeMap = {
    xs: 'h-[32px] py-[7px] px-[10px]',
    sm: 'h-[36px] py-[9px] px-[10px]',
  };
  const height = sizeMap[size] || sizeMap.sm;

  // [인풋 사이즈]
  const widthClassMap = {
    lg: 'lg:w-[300px]',
    md: 'lg:w-[180px]',
    sm: 'lg:w-[150px]',
    full: 'w-full',
  };
  const widthClass = widthClassMap[widthSize] || 'w-full';

  // [라벨 사이즈]
  const labelClassMap = {
    lg: 'min-w-[74px]',
    md: 'lg:min-w-[62px]',
    sm: 'lg:min-w-[50px]',
    full: 'w-full',
  };
  const labelClass = labelClassMap[labelSize] || 'sm';

  // 현재 선택된 옵션 (value는 객체 {value, label/name})를 받는 형태를 유지)
  const currentOption = options.find((opt) => opt?.value === value?.value) || value || {};

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div
      className={`
        flex
        items-center
        justify-start
        w-full
        ${noTransformed && widthSize === 'full' ? 'md:w-full lg:w-full' : 'md:w-[calc(50%-10px)]'}
        ${fixedFull ? 'lg:w-full' : (label && widthSize === 'full' ? 'lg:w-full' : 'lg:w-auto')}
      `}
    >
      {label && (
        <label className={`text-[14px] font-bold text-black min-w-[50px] ${labelClass}`}>
          {label}
        </label>
      )}
      <div ref={ref} className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full
            ${widthClass === 'full' ? 'lg:w-full' : `${widthClass}`}
            ${height}
            flex
            justify-between
            items-center
            gap-[4px]
            border
            border-br-gray
            rounded-[4px]
            focus:outline-none
            focus:ring-1
            focus:ring-blue-500
            border-solid
            px-[10px]
          `}
        >
          <span className="text-[14px] text-black font-normal overflow-hidden whitespace-nowrap">
            {currentOption?.label || currentOption?.name || '선택하세요'}
          </span>
          <ChevronDown />
        </button>

        {isOpen && (
          <ul
            className={`absolute w-full border border-gray-200 rounded bg-white shadow-md z-50 overflow-y-auto max-h-[500px] ${
              openDirection === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
            }`}
          >
            {options.map((option) => (
              <li
                key={`${option.value ?? ''}-${option.label ?? option.name ?? ''}`}
                className={`p-2 cursor-pointer ${
                  value?.value === option.value ? 'bg-[#E0ECE9]' : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  onChange?.(option);
                  setIsOpen(false);
                }}
              >
                {option.label || option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Select;
