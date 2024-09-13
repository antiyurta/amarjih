import { Form, Modal, message } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

// context
import { useUI } from '@context/uiContext';
import { useAuthState } from '@context/auth';

// components
import Button from '@components/common/button';
import TextArea from '@components/common/textArea';

export default function AddModal(props) {
  const { user } = useAuthState();
  const [description, setDescription] = useState('');
  // const { closeLoadingModal, openLoadingModal, displayLoadingModal } = useUI();

  const onFinish = async () => {
    if (description.length === 0) {
      message.error('Мэдээний агуулгыг оруулна уу!');
      return;
    }
    props.onFinish({
      description,
      isPublish: true,
      companyId: user.response.companyId,
    });
  };

  return (
    <Modal
      open={props.isModalVisible}
      onCancel={() => props.close()}
      width={440}
      footer={
        <div className="flex justify-end items-center">
          <div className="ml-2">
            <Button color="gray" name="Цонхыг хаах" onClick={props.close} />
          </div>
          <div className="ml-2">
            <Button name="Хадгалах" onClick={onFinish} />
          </div>
        </div>
      }
      title={<div className="font-bold text-xl">МЭДЭЭ НЭМЭХ</div>}
    >
      <div className="sm:pt-3 pb-2 sm:pb-5">
        <Form name="addRoomModal" onFinish={onFinish}>
          <div className="flex flex-col justify-center items-center">
            <div className="mb-4">
              <TextArea label="Агуулга" value={description} onChange={e => setDescription(e)} />
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
