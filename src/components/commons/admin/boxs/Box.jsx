const Box = ({ children, padding }) => {
  const { px = 16, py = 20 } = padding || {};

  return (
    <div
      className="rounded-[8px] border border-br-gray3 bg-white"
      style={{ paddingLeft: px, paddingRight: px, paddingTop: py, paddingBottom: py }}
    >
      {children}
    </div>
  );
};
export default Box;
