import React, { FC, useState } from 'react';

interface Props {
  id?: string;
  type?: string;
  name?: string;
  label?: string;
  value?: string;
  width?: string;
  onChange?: Function;
}

const TextArea: FC<Props> = ({ id, label, name, type, value, width, onChange }) => {
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: { target: { value: any } }) => {
    onChange(e.target.value);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-black">{label}</label>}
      <textarea
        id="area"
        rows={4}
        className={`${width} bg-input border text-black border-input mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm rounded text-xl`}
        onChange={handleChange}
        value={value}
      ></textarea>
    </div>
  );
};

TextArea.defaultProps = {
  width: 'w-full',
  label: 'Гарчиг',
  onChange: () => {},
};

export default TextArea;
