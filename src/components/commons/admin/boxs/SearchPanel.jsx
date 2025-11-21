import Box from './Box.jsx';
import Btn from '../../admin/forms/Btn.jsx';

const SearchPanel = ({ children, onSubmit, onReset, actions }) => {
  const handleSubmit = (event) => {
    event?.preventDefault?.();
    onSubmit?.();
  };

  const handleReset = () => {
    onReset?.();
  };

  return (
    <Box padding={{ px: 16, py: 16 }}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row lg:justify-between gap-[12px]">
          <div className="flex flex-wrap items-center gap-[20px] flex-1">
            {children}
          </div>
          <div className="flex items-center justify-end gap-[8px]">
            {actions?.map((action, idx) => (
              <Btn key={idx} {...action.props}>
                {action.label}
              </Btn>
            ))}
            {!actions && (
              <>
                <Btn size="sm" minWidth="86px" iconMode="reset" type="button" onClick={handleReset}>
                  초기화
                </Btn>
                <Btn type="submit" size="sm" minWidth="75px">
                  검색
                </Btn>
              </>
            )}
          </div>
        </div>
      </form>
    </Box>
  );
};

export default SearchPanel;

