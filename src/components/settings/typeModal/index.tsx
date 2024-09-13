import { Form, Modal } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

// context
// import { useUI } from '@context/uiContext';
import { useAuthState } from '@context/auth';

// services
import structureService from '@services/structure';

// components
import Button from '@components/common/button';
import TextField from '@components/common/TextField';

export default function TypeModal(props) {
  const { user } = useAuthState();
  const [name, setName] = useState(null);

  const onFinish = async () => {
    props.onFinish({
      name,
      type: 2,
      companyId: user.response.companyId,
      code: '001',
    });

    setName('');
  };

  const onClose = () => {
    props.close();
    setName('');
  };

  return (
    <Modal
      open={props.isModalVisible}
      onCancel={() => props.close()}
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
      title={<div className="font-bold text-xl">МЭС ЗАСЛЫН ТӨРӨЛ НЭМЭХ</div>}
    >
      <div className="sm:pt-3 pb-2 sm:pb-5">
        <Form name="addRoomModal" onFinish={onFinish}>
          <div className="flex flex-col justify-center items-center">
            <div className="mb-4">
              <TextField label="Төрлийн нэр" value={name} width="w-80" onChange={e => setName(e)} />
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
