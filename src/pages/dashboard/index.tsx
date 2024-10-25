import React, { useState, memo, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { Carousel, List, Tag } from 'antd';
import { Pagination } from 'antd';

import TextTransition, { presets } from 'react-text-transition';
import { SocketContext } from '@context/socket';

import moment from 'moment';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import MainLayout from '@components/layout/main';

// components
import CountDown from '@components/common/countDown';
import Logo from '@components/dashboard/logo';
import UserIconRow from '@components/common/UserIconRow';

// service
import taskService from '@services/task';
import newsService from '@services/news';

// utils
import nameFormatter from '@utils/NameFomatter';

// styled
import ContentWrapper from './style';
import { ImageCard } from '@components/news/selectionImage/index';

interface DoctorsType {
  id?: number;
  name?: string;
}

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

const DateCell = memo(
  ({ record, showTimer }: any) => {
    const cnt1 = useRef({});
    cnt1.current[record.firstName] = cnt1.current[record.firstName] || 0;
    // const startColumn = record.taskColumnsRels.filter(item => item.columnId === 4);
    // const endColumn = record.taskColumnsRels.filter(item => item.columnId === 5);

    let duration: any = '?';
    // if (startColumn.length > 0 && endColumn.length > 0) {
    const datetime1 = moment(record?.createdAt);
    // const datetime2 = moment(endColumn[0].createdAt);

    // let diff = datetime2.diff(datetime1);

    // duration = moment.utc(diff).format('HH:mm');
    // }

    return (
      <div className="flex flex-row items-center">
        {!showTimer ? (
          <>
            <span className="text-xl font-bold">{duration}</span>
          </>
        ) : (
          <CountDown date={record?.currentColumn?.createdAt} />
        )}
      </div>
    );
  },
  (prev, next) =>
    prev.showTimer === next.showTimer && prev.record.durationTime === next.record.durationTime
);

const Dashboard = () => {
  const socket = useContext(SocketContext);
  const [tasks, setTasks] = useState([]);
  const [today, setDate] = useState(moment());
  const [choosedNewsIndex, setChoosedNewsIndex] = useState(0);
  const [childNews, setChildNews] = useState([]);
  const currentPageNumber = useRef(1);
  const totalPageCount = useRef(0);
  const pageRenderRowCount = 10;
  const totalNewsPageCount = useRef(0);

  const loadData = async () => {
    const result: any = await taskService.getStatList();
    setTasks(result?.data?.response);
    totalPageCount.current = Math.ceil(result?.data?.response?.length / pageRenderRowCount);
  };

  const loadChildNewsData = () => {
    newsService
      .getList({
        page: 1,
        limit: 10,
        type: 'child',
      })
      .then((result: Response) => {
        setChildNews(result?.response?.data);
        totalNewsPageCount.current = result?.response?.meta?.itemCount;
      });
  };

  useEffect(() => {
    loadData();
    loadChildNewsData();
    socket.on('dashboard', function (data) {
      console.log('socket.on dashboard');
      loadData();
    });
    socket.on('news', function (data) {
      console.log('socket.on news');
      loadChildNewsData();
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage =
        totalPageCount.current <= currentPageNumber.current ? 1 : currentPageNumber.current + 1;
      currentPageNumber.current = nextPage;
      setChoosedNewsIndex(prev => prev + 1);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: <b>Дугаар</b>,
      dataIndex: 'position',
      key: 'position',
      width: 80,
      render: position => <span className="font-bold">{position}</span>,
    },
    {
      title: <b>Нэр/Овог</b>,
      dataIndex: 'firstName',
      key: 'firstName',
      render: (_, record: any) => {
        return (
          <div className="flex flex-col items-center">
            <span className="spanRow  font-bold">{record.firstName}</span>
            <span className="spanRow font-bold ml-2">{record.lastName}</span>
          </div>
        );
      },
    },
    {
      title: <b>Төлөв</b>,
      render: task => {
        return (
          <div className="">
            <Tag
              className="py-1 px-4 w-fit text-wrap"
              color={task?.column?.color}
              style={{
                borderRadius: 4,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              <div className="w-80">
                {task?.column?.name} {task?.room ? '- ' + task?.room?.name : ''}
              </div>
            </Tag>
          </div>
        );
      },
    },
    {
      title: <b>Тусламж үйлчилгээний баг</b>,
      dataIndex: 'surgery',
      key: 'surgery',
      render: (_, record: any) => {
        return (
          <div className="flex flex-row items-center">
            <div className="flex flex-row justify-start items-center">
              <div className="flex flex-row justify-start items-center">
                {record?.taskWorkers?.length > 0 && (
                  <div className="grid grid-cols-2 gap-1">
                    {(record?.taskWorkers || []).map((item, index) => (
                      <div className="w-full" key={index}>
                        <UserIconRow data={item.operation} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: <b>Эхэлсэн цаг</b>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 50,
      render: createdAt => {
        return (
          <div className="flex items-center">
            <span className="text-xl font-bold">{moment(createdAt).format('HH:mm')}</span>
          </div>
        );
      },
    },
    {
      title: <b>Дууссан цаг</b>,
      dataIndex: 'endDate',
      key: 'endDate',
      width: 50,
      render: endDate =>
        endDate ? (
          <div className="flex items-center">
            <span className="text-xl font-bold">{moment(endDate).format('HH:mm')}</span>
          </div>
        ) : (
          '?'
        ),
    },
    // {
    //   title: <b>Үргэлжилсэн хугацаа</b>,
    //   dataIndex: 'durationTime',
    //   key: 'durationTime',
    //   render: (_, record: any) => (
    //     <DateCell record={record} showTimer={record?.currentColumn?.columnId === 4} />
    //   ),
    // },
  ];
  return (
    <MainLayout>
      <div className="h-screen p-2">
        <div className={`border rounded px-3 bg-input py-4 mb-3 flex justify-between items-center`}>
          <Logo />
          <div className="text-secondary text-3xl font-bold">{today.format('YYYY/MM/DD')}</div>
        </div>
        <div className="flex flex-row gap-2 w-full">
          <div className="w-1/3 h-full">
            <Carousel autoplay autoplaySpeed={8000}>
              {childNews.map(item => (
                <div key={item?.id}>
                  <ImageCard path={item?.path} title={item?.description} isSelect={false} />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="w-full">
            <ContentWrapper>
              <Table
                columns={columns}
                dataSource={tasks}
                rowKey="id"
                pagination={{
                  total: tasks?.length,
                  current: currentPageNumber.current,
                  defaultPageSize: pageRenderRowCount,
                }}
                locale={{ emptyText: 'Жагсаалтын цонх хоосон байна.' }}
              />
            </ContentWrapper>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
