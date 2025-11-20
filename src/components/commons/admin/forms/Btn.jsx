import ExcelIcon from '../../../../assets/img/icon/excel.svg';

const Btn = ({ type = 'button', size = 'sm', isFull, textColor, colorMode = false, iconMode = '', minWidth, children, onClick }) => {
  const sizeMap = {
    xxs: 'h-[28px] text-[14px]',
    xs: 'h-[32px]',
    sm: 'h-[36px]',
    nm: 'h-[48px]',
    md: 'h-[52px]',
    lg: 'h-[60px] text-[18px] font-bold',
  };
  const height = sizeMap[size] || sizeMap.sm;

  let IconComponent = iconMode === 'excel' ? ExcelIcon : null;

  const paddingMap = {
    xxs: 'px-[8px] py-[5px]',
    xs: 'h-[32px] px-[8px] py-[8px]',
    sm: 'h-[36px] p-[10px]',
    nm: 'h-[48px]',
    md: 'h-[52px]',
    lg: 'h-[60px] text-[18px] font-bold',
  };
  const padding = paddingMap[size] || paddingMap.sm;

  const color = textColor ? `${textColor}` : (colorMode ? 'text-white' : 'text-gray1');
  const bgColor = colorMode ? 'bg-primary-blue hover:bg-primary-blue-dark text-white font-medium border-primary-blue' : 'bg-white text-gray1 font-medium border-br-color hover:bg-black hover:bg-opacity-25';

  const width = isFull ? 'w-full' : `w-auto ${padding}`;
  const minWidthSize = minWidth ? `${minWidth}` : '';

  return (
    <button
      type={type}
      className={`
        flex
        items-center
        justify-center
        rounded
        border
        ${color}
        ${width}
        ${height}
        ${bgColor}
        transition-colors duration-200
        border-solid
        border-br-gray
      `}
      style={{ minWidth: minWidthSize }}
      onClick={onClick}
    >
      {IconComponent && <img src={`${IconComponent}`} alt="" className="mr-[2px]" />}
      {children}
    </button>
  );
};
export default Btn;
