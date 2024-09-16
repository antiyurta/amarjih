import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import withAuth from '@hooks/hoc';

import taskService from '@services/task';

import RegisterParser from '@utils/RegisterParser';

import Button from '@components/common/button';

import { anesthesiaTypes } from '@datas/constants';

import { useAuthState } from '@context/auth';

interface DataType {
  id: number;
  lastName: string;
  firstName: string;
  appName: string;
  depName: string;
  phone: string;
  email: string;
  avatar: string;
}

interface Response {
  response?: any;
  success?: boolean;
  message?: string;
}

const Print = () => {
  const router = useRouter();
  const { user } = useAuthState();
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [choosedTab, setChoosedTab] = useState('1');

  console.log(user);

  useEffect(() => {
    getTasks(router.query.columnId, router.query.startDate, router.query.endDate);
  }, [router.query]);

  const getTasks = async (columnId, startDate, endDate) => {
    const result: Response = await taskService.getList(
      `?columnId=${columnId}&startDate=${startDate}&endDate=${endDate}&page=1&limit=50&authorDepId=${user.response.depId}`
    );

    const data: DataType[] = [];
    for (let i = 0; i < result.response.data.length; i++) {
      data.push({
        key: result.response.data[i].id,
        ind: i + 1,
        ...result.response.data[i],
      });
    }
    setTotal(result.response.meta.itemCount);
    setTasks(data);
  };

  console.log(tasks);

  const columns: ColumnsType<DataType> = [
    {
      title: '№',
      dataIndex: 'ind',
      key: 'ind',
      width: 40,
      render: ind => <span className="font-bold">{ind}</span>,
    },
    {
      title: 'Овог / Нэр',
      dataIndex: 'registerNumber',
      key: 'registerNumber',
      render: (_, record: any) => {
        return (
          <div className="flex flex-col">
            <div>
              <span className="text-sm">{record.firstName[0]}</span>
              <span className="">.</span>
              <span className="text-sm">{record.lastName}</span>
            </div>
            <div>
              <span className="text-sm">{record.currentAge}</span>
              <span className="ml-1"> /</span>
              <span className="text-sm ml-1">{RegisterParser(record.registerNumber).gender}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Онош',
      dataIndex: 'diagnose',
      key: 'diagnose',
      render: (_, record: any) => {
        return (
          <div className="flex flex-row items-center">
            <span className="text-sm line-clamp-2">{record?.diagnose.name}</span>
          </div>
        );
      },
    },
    {
      title: 'Бүртгэл',
      dataIndex: 'surgery',
      key: 'surgery',
      render: (_, record: any) => {
        return (
          <div className="flex flex-row items-center">
            <span className="text-sm line-clamp-2">{record?.taskWorkers[0]?.surgery.name}</span>
          </div>
        );
      },
    },
    // {
    //   title: 'HIV TIPHA HBV HCV',
    //   dataIndex: 'surgery',
    //   key: 'surgery',
    //   render: (_, record: any) => {
    //     return (
    //       <div className="flex flex-row items-center">
    //         <span className="text-sm line-clamp-2">/-/</span>
    //       </div>
    //     );
    //   },
    // },
    {
      title: 'Үргэлжлэх хугацаа',
      dataIndex: 'durationWorkTime',
      key: 'durationWorkTime',
      render: (_, record: any) => {
        return (
          <div className="flex flex-row items-center">
            {`${Math.floor(record?.durationIntTime / 60)}:${record?.durationIntTime % 60}`}
          </div>
        );
      },
    },
    {
      title: 'Огноо',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (_, record: any) => {
        return (
          <div className="flex flex-row items-center">
            <span className="text-sm">{moment(record?.startDate).format('MM/DD')}</span>
          </div>
        );
      },
    },
    {
      title: 'Багийн гишүүд',
      dataIndex: 'surgery',
      key: 'surgery',
      render: (_, record: any) => {
        const type = record?.taskWorkers[0]?.anesType;
        const anesName =
          type > 0 ? anesthesiaTypes.filter(item => item.id === type)[0].name : 'Ерөнхий';
        return (
          <div className="flex flex-row items-center">
            <div className="flex flex-row justify-start items-center">
              <div className="flex flex-row justify-start items-center">
                {record?.taskWorkers?.length > 0 && (
                  <div className="flex flex-col">
                    <div className="mb-1 mr-3">
                      {record.taskWorkers[0].operation.firstName[0]}.
                      {record.taskWorkers[0].operation.lastName}
                    </div>
                    <div className="mb-1 mr-3">
                      {record.taskWorkers[0].firstHelper.firstName[0]}.
                      {record.taskWorkers[0].firstHelper.lastName}
                    </div>
                    <div className="mb-1 mr-3">
                      {record.taskWorkers[0].secondHelper.firstName[0]}.
                      {record.taskWorkers[0].secondHelper.lastName}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Мэдээгүйжүүлгийн хэлбэр',
      dataIndex: 'surgery',
      key: 'surgery',
      render: (_, record: any) => {
        const type = record?.taskWorkers[0]?.anesType;
        const anesName =
          type > 0 ? anesthesiaTypes.filter(item => item.id === type)[0].name : 'Ерөнхий';
        return (
          <div className="flex flex-row items-center">
            <span className="text-sm line-clamp-2">{anesName}</span>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div
        className={`printHeader border rounded px-8 bg-input py-4 mb-3 flex justify-between items-center`}
      >
        <div className="text-2xl font-bold"></div>
        <div>
          {' '}
          <Button color={'blue'} name="Хэвлэх" onClick={() => window.print()} />
        </div>
      </div>
      <div className="p-3 flex text-left items-center flex-col align-left">
        <div className="flex flex-row items-center">
          <div className="flex justify-center mr-2">
            <Image
              src={`/assets/images/icon.png`}
              alt="avatar"
              width={56}
              height={45}
              objectFit="cover"
            />
          </div>
          <div className="text-xl font-bold">Налайх ЭМТ-ийн</div>
        </div>
        <div>
          <div className="text-xl mt-4 mb-4">
            {user.response.depStructure.name} мэс заслын төлөвлөгөө
          </div>
        </div>
        <div className="flex flex-row  mb-2">
          <div>Эмчилгээ эрхэлсэн дэд захирал</div>
          <div>..........................................</div>
          <div>/С.Хүрэлсүх/</div>
        </div>
        <div className="flex flex-row  mb-2">
          <div>{user.response.depStructure.name} тасгийн эрхлэгч</div>
          <div>..........................................</div>
          <div>
            /{user.response.firstName[0]}.{user.response.lastName}/
          </div>
        </div>
        <div className="flex flex-row  mb-4">
          <div>Мэдээгүйжүүлэгч эмч</div>
          <div>........................................../....................../</div>
        </div>
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'Жагсаалтын цонх хоосон байна.' }}
        />
      </div>
    </div>
  );
};

export default withAuth(Print);
