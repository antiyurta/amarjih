import React, { useState, useRef } from 'react';
import { Form, Modal } from 'antd';
import moment from 'moment';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { useReactToPrint } from 'react-to-print';
import Link from 'next/link';
const { Option } = Select;

// components
import Button from '@components/common/button';
import CustomDatePicker from '@components/common/datepicker';

// datas
import { columns } from '@datas/columns';

interface Response {
  response: any;
  success: boolean;
  message: string;
}

export default function PrintModal(props) {
  const companyId = 1;
  const componentRef = useRef(null);
  const [columnId, setColumnId] = useState(0);
  const [startDate, setStartDate] = useState(
    moment().startOf('week').isoWeekday(1).format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = useState(
    moment().startOf('week').isoWeekday(7).format('YYYY-MM-DD')
  );

  const onFinish = async values => {
    const res = await props.onFinish({
      columnId,
      startDate,
      endDate,
    });
    onClose();
  };

  const onClose = () => {
    setColumnId(0);
    props.close();
  };

  const onChangeStartDate = dateString => {
    setStartDate(dateString);
  };

  const onChangeEndDate = dateString => {
    setEndDate(dateString);
  };

  const handlePrint = () => {
    const newWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

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
            <Link href={`print?columnId=${columnId}&startDate=${startDate}&endDate=${endDate}`}>
              <a target="_blank">
                <div className="w-full h-[2.2rem] text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-bold rounded px-4 py-1 text-sm text-center inline-flex items-center justify-center">
                  Хэвлэх
                </div>
              </a>
            </Link>
          </div>
        </div>
      }
      title={<div className="font-bold text-xl">ХЭВЛЭХ ЦОНХ</div>}
    >
      <div className="">
        <Form name="cancelForm" onFinish={onFinish}>
          <div className="flex justify-center items-center flex-col">
            <div className="mb-2">
              <div className="block text-xs text-gray">Төлөв</div>
              {columns.length > 0 && (
                <Select
                  style={{ width: 240, textAlign: 'left' }}
                  onChange={e => {
                    setColumnId(e);
                  }}
                  allowClear
                >
                  <Option value={0}>Бүх төлөв</Option>
                  {columns.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </div>
            <div className="w-60 mb-2">
              <div className="block text-xs text-gray">Эхлэх огноо</div>
              <div className="mt-1 w-60">
                <CustomDatePicker onChange={onChangeStartDate} value={startDate} />
              </div>
            </div>
            <div className="w-60 mb-2">
              <div className="block text-xs text-gray">Дуусах огноо</div>
              <div className="mt-1 w-60">
                <CustomDatePicker onChange={onChangeEndDate} value={endDate} />
              </div>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
