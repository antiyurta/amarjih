import { Form, Modal, message } from 'antd';
import React, { useState, useEffect } from 'react';

// context
import { useAuthState } from '@context/auth';

// components
import Button from '@components/common/button';
import TextField from '@components/common/TextField';

export default function DescModal(props) {
  const { user } = useAuthState();
  const [name, setName] = useState(props.datas ? props.datas.name : '');

  const onFinish = async () => {
    if (name.length === 0) {
      message.error('Нэрээ оруулна уу!');
      return;
    }
    props.onFinish(props.datas?.id, {
      name,
      code: '0000',
      companyId: user.response.companyId,
      type: 3,
    });

    onClose();
  };

  const onClose = () => {
    setName('');
    props.close();
  };

  return (
    <Modal
      open={props.isModalVisible}
      onCancel={onClose}
      width={440}
      centered
      footer={
        <div className="flex h-14 justify-end items-center">
          <div className="ml-2">
            <Button color="gray" name="Цонхыг хаах" onClick={onClose} />
          </div>
          <div className="ml-2">
            <Button name="Хадгалах" onClick={onFinish} />
          </div>
        </div>
      }
      title={<div className="font-bold text-xl">{props.title || 'ТАЙЛБАР НЭМЭХ'}</div>}
    >
      <div className="sm:pt-3 pb-2 sm:pb-5">
        <Form name="addRoomModal" onFinish={onFinish}>
          <div className="flex flex-col justify-center items-center">
            <div className="mb-4">
              <TextField label="Тайлбар" width="w-80" value={name} onChange={e => setName(e)} />
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
