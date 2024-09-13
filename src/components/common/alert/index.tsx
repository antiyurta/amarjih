import React, { FC } from 'react';
import { Alert } from 'antd';

interface Props {
  type?: string;
  message?: string;
  description?: string;
  onClose?: Function;
}

const CustomAlert: FC<Props> = ({ type, message, description, onClose }) => {
  const handleClick = async values => {
    onClose();
  };

  return (
    <Alert
      description={description}
      type="error"
      style={{
        color: '#f84843',
        background: '#ffe9e9',
        border: 'none',
        fontWeight: 600,
        padding: 16,
        fontSize: 11,
        width: 'auto',
      }}
      // showIcon
      closable
      onClose={handleClick}
    />
  );
};

CustomAlert.defaultProps = {
  type: 'error',
  message: 'message',
  description: 'my button',
};

export default CustomAlert;
