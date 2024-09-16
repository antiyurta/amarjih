import { Form, Modal, message } from 'antd';
import React, { useState } from 'react';

// context
import { useAuthState } from '@context/auth';

// components
import Button from '@components/common/button';
import TextArea from '@components/common/textArea';
import SelectionImage from '../selectionImage';

export default function AddModal(props) {
  const images = [
    { path: '/assets/images/children/female.png', title: 'Эмэгтэй' },
    { path: '/assets/images/children/male.png', title: 'Эрэгтэй' },
    { path: '/assets/images/children/twin.png', title: 'Ихэр' },
    { path: '/assets/images/children/twin-female.png', title: 'Эмэгтэй ихэр' },
    { path: '/assets/images/children/twin-male.png', title: 'Эрэгтэй ихэр' },
  ];
  const { user } = useAuthState();
  const [description, setDescription] = useState('');
  const [current, setCurrent] = useState('');
  // const { closeLoadingModal, openLoadingModal, displayLoadingModal } = useUI();

  const onFinish = async () => {
    if (description.length === 0) {
      message.error('Мэдээний агуулгыг оруулна уу!');
      return;
    }
    if (current == '') {
      message.error('Зураг сонгоно уу.');
      return;
    }
    props.onFinish({
      description,
      path: current,
      isPublish: true,
      companyId: user.response.companyId,
    });
  };

  return (
    <Modal
      open={props.isModalVisible}
      onCancel={() => props.close()}
      width={1300}
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
          <div className="flex flex-row justify-center gap-1">
            {images.map((item, index) => (
              <SelectionImage
                path={item.path}
                title={item.title}
                key={index}
                isSelect={current == item.path}
                onClick={() => setCurrent(item.path)}
              />
            ))}
          </div>
          <div className="mx-4">
            <TextArea label="Агуулга" value={description} onChange={e => setDescription(e)} />
          </div>
        </Form>
      </div>
    </Modal>
  );
}
