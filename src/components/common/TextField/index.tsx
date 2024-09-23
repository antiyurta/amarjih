import React, { FC, useState, useEffect } from 'react';

interface Props {
  id?: string;
  type?: string;
  name?: string;
  label?: string;
  value?: any;
  width?: string;
  onChange?: Function;
  error?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  require?: boolean;
}

const TextField: FC<Props> = ({
  id,
  label,
  name,
  type,
  value,
  width,
  error,
  errorMessage,
  onChange,
  disabled,
  require,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(error);

  useEffect(() => {
    setShowError(error);
  }, [error]);

  const handleChange = (e: { target: { value: any } }) => {
    onChange(e.target.value);
    if (e.target.value.length > 0) setShowError(false);
  };

  const customClassName = !showError
    ? `${width} h-[2.2rem] bg-input text-black text-sm border rounded border-input mt-1 p-2 focus:border-blue-500 focus:outline-none block`
    : `${width} h-[2.2rem] text-black appearance-none border border-red-500 rounded px-2 py-1 mt-1 mb-1 leading-tight focus:outline-none focus:shadow-outline`;

  return (
    <div>
      {label && (
        <div className="flex text-sm text-black">
          {label} {require ? <div className="text-sm text-red-600 ml-1">*</div> : ''}
        </div>
      )}
      <input
        type={type}
        name={name}
        id={id}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        className={customClassName}
      />
      {showError && (
        <p className="font-medium tracking-wide text-red-500 text-xs">{errorMessage}</p>
      )}
    </div>
  );
};

TextField.defaultProps = {
  width: 'w-60',
  disabled: false,
  error: false,
  onChange: () => {},
};

export default TextField;
