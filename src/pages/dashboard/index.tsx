import React, { useState, memo, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { Tag } from 'antd';
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
  const [news, setNews] = useState([]);
  const currentPageNumber = useRef(1);
  const totalPageCount = useRef(0);
  const pageRenderRowCount = 6;

  const loadData = async () => {
    const result: any = await taskService.getStatList();
    setTasks(result?.data?.response);
    totalPageCount.current = Math.ceil(
      result?.data?.response?.filter(
        res => res.currentColumn?.columnId > 1 && res.currentColumn?.columnId < 14
      ).length / pageRenderRowCount
    );
  };

  const loadNewsData = () => {
    const arr = [];
    newsService.getList('?page=1&limit=10').then((result: Response) => {
      for (let i = 0; i < result?.response?.data?.length; i++) {
        arr.push(result.response.data[i].description);
      }
      setNews(arr);
      setChoosedNewsIndex(0);
    });
  };

  useEffect(() => {
    loadData();
    loadNewsData();
    socket.on('dashboard', function (data) {
      console.log('socket.on dashboard');
      loadData();
    });
    socket.on('news', function (data) {
      console.log('socket.on news');
      loadNewsData();
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage =
        totalPageCount.current === currentPageNumber.current ? 1 : currentPageNumber.current + 1;
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
      title: <b>Овог/ Нэр</b>,
      dataIndex: 'firstName',
      key: 'firstName',
      render: (_, record: any) => {
        return (
          <div className="flex flex-row items-center">
            <span className="spanRow text-sm text-black font-medium">
              {nameFormatter(record.firstName)}
            </span>
            <span className="spanRow text-sm text-black font-medium ml-2">
              {nameFormatter(record.lastName)}
            </span>
          </div>
        );
      },
    },
    {
      title: <b>Төлөв</b>,
      dataIndex: 'column',
      key: 'column',
      render: column => {
        return (
          <div className="">
            <Tag
              className="py-1 px-4 w-fit"
              color={column?.color}
              style={{
                borderRadius: 4,
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            >
              <div className="w-auto">{column?.name}</div>
            </Tag>
          </div>
        );
      },
    },
    // {
    //   title: <b>Тасаг</b>,
    //   dataIndex: 'surgery',
    //   key: 'surgery',
    //   render: (_, record: any) => {
    //     return (
    //       <div className="flex flex-wrap w-36">
    //         <span className="spanRow text-sm">{record?.authorDep?.name}</span>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: <b>Мэдээгүйжүүлгийн эмч</b>,
    //   dataIndex: 'surgery',
    //   key: 'surgery',
    //   render: (_, record: any) => {
    //     return (
    //       <div className="flex flex-col">
    //         {record.taskDoctorRels.map(item => {
    //           return (
    //             <div className="mb-1 mr-3">
    //               <UserIconRow data={item?.user} />
    //               {/* <span className="spanRow text-sm">{`${item?.user?.firstName[0]}.${item?.user?.lastName}`}</span> */}
    //             </div>
    //           );
    //         })}
    //       </div>
    //     );
    //   },
    // },
    {
      title: <b>Баг, бүрэлдхүүн</b>,
      dataIndex: 'surgery',
      key: 'surgery',
      render: (_, record: any) => {
        return (
          <div className="flex flex-row items-center">
            <div className="flex flex-row justify-start items-center">
              <div className="flex flex-row justify-start items-center">
                {record?.taskWorkers?.length > 0 && (
                  <div className="flex flex-col">
                    {(record?.taskWorkers || []).map((item, index) => (
                      <div className="mb-1 mr-3" key={index}>
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
      render: createdAt => {
        return (
          <div className="flex items-center">
            <span className="text-xl font-bold">{moment(createdAt).format('HH:mm')}</span>
          </div>
        );
      },
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
          <div className="text-secondary text-lg font-bold">{today.format('YYYY/MM/DD')}</div>
        </div>
        <div className="text-xl h-20 font-bold  mt-4 mb-4 flex items-center">
          <div className="bg-yellow w-1/12 h-20 rounded flex items-center justify-center">
            <div className="text-white text-base">Мэдээлэл</div>
          </div>
          <div className="bg-white h-20 min-h-full w-11/12 flex items-center overflow-hidden text-xl">
            {news.length && (
              <div className="ml-5">
                {news.length > 0 && (
                  <TextTransition springConfig={presets.wobbly}>
                    {news[choosedNewsIndex % news.length]}
                  </TextTransition>
                )}
              </div>
            )}
          </div>
        </div>
        <div>
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
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
              }
            />
          </ContentWrapper>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
