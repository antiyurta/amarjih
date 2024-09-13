import { TimePicker } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import React from 'react';
import ContenWrapper from './style';

interface Props {
  value?: string;
  label?: string;
  onChange?: Function;
}

const format = 'HH:mm';

const CustomTimePicker: React.FC<Props> = ({ label, value, onChange }) => {
  const handleChange = (time: Moment, timeString: string) => {
    console.log('time: ', timeString);
    onChange(timeString);
  };

  return (
    <div className="mt-1 ">
      <ContenWrapper>
        <TimePicker
          // onChange={handleChange}
          onChange={handleChange}
          defaultValue={moment(value, format)}
          value={moment(value, format)}
          format={format}
          className="w-28"
          placeholder={label}
        />
      </ContenWrapper>
    </div>
  );
};

CustomTimePicker.defaultProps = {
  value: moment().format(format),
};

export default CustomTimePicker;
