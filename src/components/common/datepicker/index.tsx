import { DatePicker, DatePickerProps } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import React from 'react';
import ContenWrapper from './style';

interface Props {
  value?: string;
  onChange?: Function;
}

const dateFormat = 'YYYY-MM-DD';

const CustomDatePicker: React.FC<Props> = ({ value, onChange }) => {
  const handleChange: DatePickerProps['onChange'] = (date, dateString) => {
    onChange(dateString);
  };

  return (
    <ContenWrapper>
      <div className="mt-1 ">
        <DatePicker
          placeholder="Өдөр сонгох"
          onChange={handleChange}
          defaultValue={moment(value, dateFormat)}
          value={moment(value, dateFormat)}
          format={dateFormat}
          className="w-60"
        />
      </div>
    </ContenWrapper>
  );
};

CustomDatePicker.defaultProps = {
  value: moment().format(dateFormat),
};

export default CustomDatePicker;
