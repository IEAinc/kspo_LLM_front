const PageSizeSelector = ({ pageSize, onPageSizeChange, width = '80px' }) => {
  const options = [10, 20, 50, 100];
  return (
    <select
      className="border border-br-gray rounded px-2 py-1 text-[14px]"
      style={{ width }}
      value={pageSize}
      onChange={(e) => onPageSizeChange(Number(e.target.value))}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt} / page
        </option>
      ))}
    </select>
  );
};
export default PageSizeSelector;
