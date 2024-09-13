import { Button, Modal } from 'antd';
import React, { useState, FC } from 'react';

interface Props {
  title?: string;
  description?: string;
  onAgree?: Function;
  onCancel?: Function;
  isModalVisible?: boolean;
}

const ConfirmModal: FC<Props> = ({ title, description, isModalVisible, onAgree, onCancel }) => {
  const [isOpen, setIsModalVisible] = useState(isModalVisible);
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    onAgree();
    setLoading(false);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    onCancel();
    setLoading(false);
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title={<div className="text-xl">{title}</div>}
        centered
        open={isModalVisible}
        width={370}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button onClick={handleCancel}>Үгүй</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Тийм
          </Button>,
        ]}
      >
        <p>{description}</p>
      </Modal>
    </>
  );
};

export default ConfirmModal;
