import React from 'react';
import Input from '../../admin/forms/Input.jsx';
import CustomDatePicker from "../forms/CustomDatepicker.jsx";
import SearchPanel from './SearchPanel.jsx';

const AdminUserSearchBox = ({ criteria, onChange, onSubmit, onReset }) => {
  return (
    <SearchPanel onSubmit={onSubmit} onReset={onReset}>
      <Input
        labelName="성함/아이디"
        type="text"
        placeholder="성함 또는 아이디"
        value={criteria.name || ''}
        onChange={(e) => onChange({ ...criteria, name: e.target.value })}
        options={{ widthSize: 'lg', labelSize: 'lg' }}
      />
      <CustomDatePicker
        options={{ widthSize: 'md', labelSize: 'sm' }}
        startDate={criteria.startDate}
        endDate={criteria.endDate}
        onStartDateChange={(date) => onChange({ ...criteria, startDate: date })}
        onEndDateChange={(date) => onChange({ ...criteria, endDate: date })}
      />
    </SearchPanel>
  );
};

export default AdminUserSearchBox;
