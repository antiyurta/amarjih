import React, { useState, useEffect } from 'react';
import { Select, Col, Row } from 'antd';
import { Chart } from 'react-google-charts';
import moment from 'moment';

import taskService from '@services/task';
import reportService from '@services/report';
import structureService from '@services/structure';

import TopUserRow from '@components/common/topUserRow';

const { Option } = Select;

interface Response {
  response?: any;
  success?: boolean;
  message?: string;
}

const options = {
  allowHtml: true,
  showRowNumber: true,
  colors: ['#60BBFF', '#ffab91'],
  hAxis: { title: 'Months' },
  vAxis: { title: 'Count', minValue: 0 },
};

const Dashboard = props => {
  interface Response {
    data: any;
  }

  const [counts, setCounts] = useState([]);
  const [months, setMonths] = useState([
    ['', ''],
    ['01', 10],
    ['02', 10],
    ['03', 10],
    ['04', 10],
    ['04', 10],
    ['04', 10],
    ['04', 10],
    ['04', 10],
    ['04', 10],
    ['04', 10],
    ['04', 10],
  ]);
  const [deps, setDeps] = useState([]);
  const [choosedDepId, setChoosedDepId] = useState(0);
  const [cancelTasks, setCancelTasks] = useState([
    ['Task', 'Hours per Day'],
    ['Ар гэрийн хүсэлтээр', 11],
    ['Өвчтөний биеийн байдал', 2],
    ['Нас барсан', 2],
  ]);
  const [users, setUsers] = useState({
    doctor: {
      appName: 'Эмч',
      depName: 'Хагалгаа, мэдээгүйжүүлгийн нэгдсэн тасаг',
      firstName: 'Лхагвасүрэн',
      lastName: 'Чинбат',
      taskcount: '16',
      userId: 82,
      avatarId: 354,
      duty: 4,
    },
    nurse: {
      appName: 'Эмч',
      depName: 'Хагалгаа, мэдээгүйжүүлгийн нэгдсэн тасаг',
      firstName: 'Лхагвасүрэн',
      lastName: 'Чинбат',
      taskcount: '16',
      userId: 82,
      avatarId: 354,
      duty: 5,
    },
    operation: {
      appName: 'Эмч',
      depName: 'Хагалгаа, мэдээгүйжүүлгийн нэгдсэн тасаг',
      firstName: 'Лхагвасүрэн',
      lastName: 'Чинбат',
      taskcount: '16',
      userId: 82,
      avatarId: 354,
      duty: 3,
    },
    firstHelper: {
      appName: 'Эмч',
      depName: 'Хагалгаа, мэдээгүйжүүлгийн нэгдсэн тасаг',
      firstName: 'Лхагвасүрэн',
      lastName: 'Чинбат',
      taskcount: '16',
      userId: 82,
      avatarId: 354,
      duty: 1,
    },
    secondHelper: {
      appName: 'Эмч',
      depName: 'Хагалгаа, мэдээгүйжүүлгийн нэгдсэн тасаг',
      firstName: 'Лхагвасүрэн',
      lastName: 'Чинбат',
      taskcount: '16',
      userId: 82,
      avatarId: 354,
      duty: 2,
    },
  });
  const [dutys, setDutys] = useState([1, 2, 3, 4, 5]);
  const [loadings, setLoadings] = useState(false);

  useEffect(() => {
    geRangesCount();
    getCancelTasks();
    getTopUsers();
  }, []);

  useEffect(() => {
    getDepList();
    getRangeMonthStatCounts(choosedDepId);
  }, [choosedDepId]);

  const geRangesCount = async () => {
    const result: any = await taskService.getRangeStatCounts();
    setCounts(result.response);
    setLoadings(false);
  };

  const getRangeMonthStatCounts = async depId => {
    const result: any = await taskService.getRangeMonthStatCounts('?depId=' + depId);
    const datas = [];
    for (const i in result.response) {
      datas.push({
        count: result.response[i].count,
        month: `${result.response[i].month.toString()}-р сар`,
      });
    }
    setMonths(datas);
  };

  const getDepList = async () => {
    const result: any = await structureService.getList(`?type=1&companyId=1`);
    setDeps(result.response.data);
  };

  const getCancelTasks = async () => {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD hh:mm');
    const result: any = await reportService.getCancelTaskCount(
      `?startDate=${startOfMonth}&endDate=${endOfMonth}`
    );
    const datas = [['', '']];

    for (const i in result.data.response) {
      datas.push([result.data.response[i].name, `${result.data.response[i].count}`]);
    }

    // setCancelTasks(datas);
  };

  const getTopUsers = async () => {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD hh:mm');
    const result: any = await reportService.getTopUser(
      `?startDate=${startOfMonth}&endDate=${endOfMonth}`
    );
    setUsers(result.data.response);
  };

  return (
    <div className="w-full">
      <div>
        <div className="flex justify-between mb-4 mt-8">
          <p className="text-md font-bold">Мэс заслын тоон үзүүлэлт</p>
        </div>
        <div>
          {' '}
          <Row gutter={16}>
            {counts.length > 0 &&
              counts.map(row => {
                return (
                  <Col span={4}>
                    <div className="shadow-lg rounded-md h-44">
                      <div className="font-bold bg-[#60BBFF] text-white h-10 py-3 text-sm">
                        {row.title}
                      </div>
                      <p className="font-bold text-xl mt-4">{row?.totalCount}</p>
                      <p className="font-bold text-lg text-red-500 mt-3">
                        Эрчимт - {row?.hardCount}
                      </p>
                      <p className="font-bold text-gray">Нас баралт - {row?.diedCount}</p>
                    </div>
                  </Col>
                );
              })}
          </Row>
        </div>
      </div>
      <div className="mt-20">
        <div className="flex justify-between mb-8">
          <div>
            <p className="text-md font-bold">Сарын харьцуулалт</p>
          </div>
          <div className="ml-4">
            {deps && deps.length > 0 && (
              <Select
                defaultValue={choosedDepId}
                style={{ width: 240, textAlign: 'left' }}
                onChange={e => {
                  setChoosedDepId(e);
                }}
                allowClear
              >
                <Option value={0}>Бүх тасаг</Option>
                {deps.map(item => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </div>
        </div>
        <div className="border-2 p-5 rounded-xl h-[340px]">
          <div className="grid grid-cols-12 h-full">
            {months.map(item => {
              return <BarItem {...item} />;
            })}
          </div>
        </div>
      </div>
      <div className="mt-20 flex flex-row">
        <div className="">
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-md font-bold">Шилдэг ажилтан /Энэ сар/</p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center border-2 p-5 rounded-xl">
            <div className="mr-8">
              <TopUserRow data={users?.operation} />
            </div>
            <div className="mr-8">
              <TopUserRow data={users?.firstHelper} />
            </div>
            <div className="mr-8">
              <TopUserRow data={users?.secondHelper} />
            </div>
            <div className="mr-8">
              <TopUserRow data={users?.doctor} />
            </div>
            <div className="mr-8">
              <TopUserRow data={users?.nurse} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <div>
          <div className="flex justify-between mb-6">
            <p className="text-md font-bold">Цуцалсан мэс засал /Энэ сар/</p>
          </div>
          <div className="border-2 p-5 rounded-xl w-[700px]">
            <Chart
              chartType="PieChart"
              height="360px"
              data={cancelTasks}
              options={{
                pieHole: 0.5,
                is3D: false,
                colors: ['#51BEFF', '#FFDD6A', '#FF698A'],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const BarItem = data => {
  const height = data.count > 0 ? `${data.count / 2}px` : `14px`;
  return (
    <div className="flex flex-col justify-end w-14 mr-6">
      <div className="font-bold text-md mb-2">{data.count}</div>
      <div
        style={{ height, backgroundColor: data.count === 0 ? '#D4D4D4' : '#60BBFF' }}
        className="rounded-t-xl"
      ></div>
      <div className="text-sm font-bold mt-2 text-[#6A6A6A]">{data.month}</div>
    </div>
  );
};

export default Dashboard;
