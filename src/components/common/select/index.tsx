import { Select } from 'antd';
import React, { FC } from 'react';

import ContenWrapper from './style';

const { Option } = Select;

interface Props {
  items?: Array<Type>;
  label?: string;
  value?: any;
  width?: string;
  onChange?: Function;
  onSearch?: Function;
  require?: boolean;
}

interface Type {
  id: any;
  name: string;
}

const CustomSelect: FC<Props> = ({ label, items, width, value, onChange, onSearch, require }) => {
  const [selectValue, setValue] = React.useState(value);

  const handleChange = async e => {
    onChange(e);
    setValue(e);
  };

  const handleSearch = async (value: string) => {
    onSearch('search: ', value);
    console.log('search:', value);
  };

  return (
    <ContenWrapper>
      <div>
        {label && (
          <div className="flex text-sm text-black">
            {label}
            {require ? <div className="text-sm text-red-600 ml-1">*</div> : ''}
          </div>
        )}
        <Select
          showSearch
          className={`${width} bg-input text-black text-sm mt-1 text-left`}
          value={value !== 0 ? value : ''}
          onChange={handleChange}
          onSearch={handleSearch}
          placeholder="Утгуудаас сонгоно уу!"
          optionFilterProp="children"
          filterOption={(input, option) => (option!.children as unknown as string).includes(input)}
        >
          {items.map(item => {
            return (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </div>
    </ContenWrapper>
  );
};

CustomSelect.defaultProps = {
  width: 'w-60',
  label: 'my combo',
  items: [
    {
      id: 1,
      name: 'Liverpool',
    },
    {
      id: 2,
      name: 'Arsenal',
    },
    {
      id: 3,
      name: 'Deren',
    },
  ],
  onChange: e => console.log(e),
};

export default CustomSelect;
