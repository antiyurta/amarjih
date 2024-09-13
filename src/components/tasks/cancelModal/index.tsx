import React, { useState } from 'react';
import { Form, Modal } from 'antd';
import { Select } from 'antd';
import type { SelectProps } from 'antd';

// components
import Button from '@components/common/button';
import TextField from '@components/common/TextField';

interface Response {
  response: any;
  success: boolean;
  message: string;
}

export default function CancelModal(props) {
  const companyId = 1;
  const [description, setDescription] = useState(null);

  const onFinish = async values => {
    const res = await props.onFinish({
      description,
    });
    onClose();
  };

  const onClose = () => {
    setDescription('');
    props.close();
  };

  const options = [];
  props.datas.forEach(element => {
    options.push({ value: element.name, label: element.name });
  });

  return (
    <Modal
      open={props.isModalVisible}
      onCancel={onClose}
      width={420}
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
      title={<div className="font-bold text-xl">ЦУЦЛАХ ЦОНХ</div>}
    >
      <div className="">
        <Form name="cancelForm" onFinish={onFinish}>
          <div className="flex justify-center items-center flex-col">
            <div className="mb-2 w-80">
              <Select
                showSearch
                placeholder="Цуцалсан шалтгаан"
                optionFilterProp="children"
                onChange={e => setDescription(e)}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={options}
                style={{ width: 300 }}
              />
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
