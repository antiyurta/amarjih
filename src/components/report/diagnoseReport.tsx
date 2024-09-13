import React, { useState, useEffect } from 'react';
import { DatePicker, Spin } from 'antd';
import { Select, Button } from 'antd';
import moment from 'moment';

import { Chart } from 'react-google-charts';

import reportService from '@services/report';
import directoryService from '@services/directory';

interface IResponse {
  response?: any;
}

interface Response {
  data: any;
}

const dateFormat = 'YYYY-MM-DD';
const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

// export const options = {
//   title: 'Тохиолдол ихтэй 10 онош',
// };

// export const optionsAge = {
//   title: 'Сонгосон онош насны ангилалаар',
// };

export const options = {
  allowHtml: true,
  showRowNumber: true,
};

export const formatters = [
  {
    type: 'BarFormat' as const,
    column: 1,
    options: {
      width: 740,
    },
  },
];

const DiagnoseReport = props => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [diagnoseCounts, setDiagnoseCounts] = useState([]);
  const [diagnoseCountsAge, setDiagnoseCountsAge] = useState([]);
  const [choosedDiagnoseId, setChoosedDiagnoseId] = useState(0);
  const [isReload, setReload] = useState(false);
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(lastDay.toISOString().split('T')[0]);
  const [loadings, setLoadings] = useState(false);

  useEffect(() => {
    if (loadings === false) return;
    getDiagnoseCounts(`?startDate=${startDate}&endDate=${endDate}`);
    getDiagnoseCountsAge(
      `?startDate=${startDate}&endDate=${endDate}&diagnoseId=${choosedDiagnoseId}`
    );
  }, [isReload, loadings, choosedDiagnoseId]);

  const getDiagnoseCounts = async query => {
    const response: Response = await reportService.getDiagnoseCount(query);
    const temp = [['Онош', 'Үзүүлэлт']];
    const temp2 = [];
    await response.data.response.map(item => {
      temp.push([item.name, item.count]);
      temp2.push({
        label: item.name,
        value: item.id,
      });
    });
    await setDiagnoses(temp2);
    await setDiagnoseCounts(temp);
    await setLoadings(false);
  };

  const getDiagnoseCountsAge = async query => {
    const response: Response = await reportService.getDiagnoseCountAges(query);
    const temp = [['Нас', 'Үзүүлэлт']];
    await response.data.response.map(item => {
      temp.push([item.minAge + '-' + (item.maxAge === 200 ? 'дээш' : item.maxAge), item.count]);
    });

    setDiagnoseCountsAge(temp);
  };

  const getDiagnoses = async () => {
    const result: IResponse = await directoryService.getList('?type=1');
    setDiagnoses(result.response);
  };

  const onChangeStartDate = async (date, dateString) => {
    setStartDate(dateString);
  };

  const onChangeEndDate = async (date, dateString) => {
    setEndDate(dateString);
  };

  const handleChangeDiagnose = async id => {
    setChoosedDiagnoseId(id);
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
          <div className="flex items-start flex-col mr-4 mt-8">
            <Button type="primary" loading={loadings} onClick={() => setLoadings(true)}>
              Харах
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-start">
        {diagnoseCounts.length > 1 ? (
          <div>
            <Chart
              chartType="Table"
              width="100%"
              height="100%"
              data={diagnoseCounts}
              options={options}
              formatters={formatters}
            />
          </div>
        ) : (
          ''
        )}
      </div>
      <div className="mt-8 flex justify-start">
        {diagnoses.length > 1 ? (
          <div>
            <div className="font-bold text-xl text-left mb-3">Насны ангилалаар</div>
            <div className="mb-4 flex flex-row justify-center items-center">
              <div className="mr-3">Онош сонгох</div>
              <Select
                defaultValue={choosedDiagnoseId}
                style={{ width: 320 }}
                onChange={handleChangeDiagnose}
                options={diagnoses}
              />
            </div>
            <Chart
              chartType="Table"
              width="100%"
              data={diagnoseCountsAge}
              options={options}
              formatters={formatters}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default DiagnoseReport;
