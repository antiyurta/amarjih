import { Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

// components
import Button from '@components/common/button';
import TextField from '@components/common/TextField';
import CustomSelect from '@components/common/select';
import ColumnService from '@services/column';
import { getTaskByValue } from '@utils/static-data';

export default function RoomModal(props) {
  const [columns, setColumns] = useState([]);
  const [columnId, setColumnId] = useState();
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const onFinish = async () => {
    props.onFinish({
      columnId,
      name,
      number,
      companyId: 1,
    });
  };

  const onClose = () => {
    props.close();
    setName('');
    setNumber('');
  };
  const getColumns = async () => {
    const result = await ColumnService.getList({ isAll: true });
    if (result?.success) {
      setColumns(result?.response);
    }
  };

  useEffect(() => {
    getColumns();
  }, [props]);
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
      title={<div className="font-bold text-xl">ӨРӨӨ НЭМЭХ</div>}
    >
      <div className="sm:pt-3 pb-2 sm:pb-5">
        <Form name="addRoomModal" onFinish={onFinish}>
          <div className="flex flex-col justify-center items-center">
            <div className="mb-4">
              <CustomSelect
                label="Шилжих тасаг"
                width="w-80"
                value={columnId}
                onChange={e => setColumnId(e)}
                onSearch={e => {
                  console.log(e);
                }}
                items={columns.map(item => ({
                  id: item?.id,
                  name: `${getTaskByValue(item?.taskType)} - ${item?.name}`,
                }))}
              />
            </div>
            <div className="mb-4">
              <TextField label="Нэр" width="w-80" onChange={e => setName(e)} />
            </div>
            <div className="mb-2">
              <TextField label="Дугаар" width="w-80" onChange={e => setNumber(e)} />
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
