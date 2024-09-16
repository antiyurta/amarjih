import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

import reportService from '@services/report';

interface Response {
  response?: any;
  success?: boolean;
  message?: string;
}

const dateFormat = 'YYYY-MM-DD';
const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

export const options = {
  title: 'Тохиолдол ихтэй 10 мэс засал',
};

export const optionsAge = {
  title: 'Сонгосон мэс засал насны ангилалаар',
};

const RoomReport = props => {
  interface Response {
    data: any;
  }

  const [rooms, setRooms] = useState([]);
  const [isReload, setReload] = useState(false);
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(lastDay.toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCounts(`?startDate=${startDate}&endDate=${endDate}`);
  }, [isReload, startDate, endDate]);

  const getCounts = async query => {
    const response: Response = await reportService.getRoomTaskCount(query);
    setRooms(response.data.response);
  };

  const onChangeStartDate = async (date, dateString) => {
    setStartDate(dateString);
  };

  const onChangeEndDate = async (date, dateString) => {
    setEndDate(dateString);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-start items-center">
        <div className="flex flex-row">
          <div className="flex items-start flex-col mr-4">
            <span className="mb-2">Эхлэх огноо</span>
            <DatePicker
              defaultValue={moment(startDate, dateFormat)}
              className="h-9"
              onChange={onChangeStartDate}
            />
          </div>
          <div className="flex items-start flex-col mr-4">
            <span className="mb-2">Дуусах огноо</span>
            <DatePicker
              defaultValue={moment(endDate, dateFormat)}
              className="h-9"
              onChange={onChangeEndDate}
            />
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-5 gap-4 mt-4">
        {rooms.map(item => {
          return (
            <div className="relative bg-input h-56 p-3 rounded-xl border flex justify-center flex-col">
              <div className="mb-1 text-2xl font-bold text-subtitle">№ {item.roomNumber}</div>
              <div className="mb-1 text-sm font-bold text-subtitle">Бүртгэл: {item.taskCount}</div>
              <div className="mb-1 text-sm font-bold text-subtitle">
                Дундаж цаг: {(item.durationTime / 60).toFixed(2)}
              </div>
              <div className="mb-1 text-gray">{status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomReport;
