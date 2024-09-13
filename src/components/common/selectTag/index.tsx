import { Select } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { FC, useState, useEffect } from 'react';

interface Props {
  items?: Array<Type>;
  label?: string;
  value?: Array<TypeId>;
  onChange?: Function;
}

interface Type {
  label: string;
  value: number;
}

interface TypeId {
  id: number;
}

// const tagRender = (props: CustomTagProps) => {
//   const { label, value, closable, onClose } = props;
//   const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
//     event.preventDefault();
//     event.stopPropagation();
//   };

//   return <div className="p-1 border rounded-lg m-0.5">{label}</div>;
// };

const CustomTagSelect: FC<Props> = ({ label, value, items, onChange }) => {
  const [defValue, setValue] = useState(value);
  console.log('default choosed: ', defValue);
  useEffect(() => {
    setValue(value);
  }, [value]);

  const handleChange = async e => {
    onChange(e);
  };

  return (
    <div className="w-80">
      {label && <div className="block text-xs text-gray">{label}</div>}
      <Select
        mode="multiple"
        showArrow
        defaultValue={defValue}
        onChange={handleChange}
        style={{ width: '100%' }}
        options={items}
        className="w-80 mt-1 bg-input border text-input border-input border-input focus:ring-indigo-500 focus:border-indigo-500 block"
      />
    </div>
  );
};

CustomTagSelect.defaultProps = {
  items: [
    { label: 'Баасансүрэн', value: 1 },
    { label: 'Эрдэнэбилэг', value: 2 },
    { label: 'Батдаваа', value: 3 },
    { label: 'Бат-Эрдэнэ', value: 4 },
  ],
};

export default CustomTagSelect;
