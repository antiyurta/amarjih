import React, { useState, useEffect } from 'react';
import { Form, Modal, message } from 'antd';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

// context
import { useAuthState } from '@context/auth';

// components
import Button from '@components/common/button';
import TextField from '@components/common/TextField';

export default function DepModal(props) {
  const { user } = useAuthState();
  const [checked, setChecked] = useState(true);
  const [name, setName] = useState(props.datas ? props.datas.name : '');
  const [isReport, setIsReport] = useState(props.datas ? props.datas.isReport : true);
  const [shortName, setShortName] = useState(props.datas ? props.datas.shortName : '');

  const onFinish = async () => {
    if (name.length === 0) {
      message.error('Нэрээ оруулна уу!');
      return;
    }
    props.onFinish(props.datas?.id, {
      name,
      shortName,
      parentId: user.response.companyId,
      companyId: user.response.companyId,
      position: 1,
      type: 1,
      isReport,
    });

    onClose();
  };

  const onClose = () => {
    setName('');
    setShortName('');
    props.close();
  };

  const onChange = (e: CheckboxChangeEvent) => {
    console.log('checked = ', e.target.checked);
    setIsReport(e.target.checked);
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
      title={<div className="font-bold text-xl">{props.title || 'ТАСАГ НЭМЭХ'}</div>}
    >
      <div className="sm:pt-3 pb-2 sm:pb-5">
        <Form name="addRoomModal" onFinish={onFinish}>
          <div className="flex flex-col justify-center items-center">
            <div className="mb-4">
              <TextField label="Нэр" width="w-80" value={name} onChange={e => setName(e)} />
            </div>
            <div className="mb-4">
              <TextField
                label="Товчилсон нэр"
                width="w-80"
                value={shortName}
                onChange={e => setShortName(e)}
              />
            </div>
            <p style={{ marginBottom: '20px' }}>
              <Checkbox checked={isReport} onChange={onChange}>
                {'Тайлан авах эсэх'}
              </Checkbox>
            </p>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
