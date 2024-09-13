import React, { FC } from 'react';
import moment from 'moment';
import { Divider } from 'antd';

// utils
import nameFormatter from '@utils/NameFomatter';

// components
import CountDown from '@components/common/countDown';

interface Props {
  lastName?: string;
  firstName?: string;
  durationTime?: string;
  endTime?: string;
  // operation?: any;
  // firstHelper?: any;
  room?: any;
  // secondHelper?: any;
  id?: number;
  currentColumn?: any;
  color?: string;
  columnId?: number;
  authorDep?: any;
  timer?: boolean;
  taskWorkers?: any;
}

const TaskCard: FC<Props> = ({
  lastName,
  firstName,
  durationTime,
  color,
  room,
  authorDep,
  currentColumn,
  timer,
  taskWorkers,
}) => {
  const bgColor = `bg-${color}`;
  const fontColor = color !== 'white' ? '#FFFFFF' : 'black';

  return (
    <div className="bg-white p-3 hidden rounded-xl border-2 border-orange">
      <div className="flex flex-row items-center mb-1">
        <div
          style={{ background: color, borderColor: color }}
          className={`rounded-md border w-8 h-8 flex justify-center items-center mr-2`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 18.3334C14.6024 18.3334 18.3334 14.6025 18.3334 10.0001C18.3334 5.39771 14.6024 1.66675 10 1.66675C5.39765 1.66675 1.66669 5.39771 1.66669 10.0001C1.66669 14.6025 5.39765 18.3334 10 18.3334Z"
              stroke={fontColor}
              strokeOpacity="0.4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 5V10L13.3333 11.6667"
              stroke={fontColor}
              strokeOpacity="0.4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {timer === false ? (
          <>
            <span className="text-xl font-bold">{durationTime}</span>
          </>
        ) : (
          <CountDown date={currentColumn.createdAt} />
        )}
      </div>
      <div className="px-2">
        <span className="text-sm text-black font-medium">{nameFormatter(firstName)}</span>
        <span className="text-xl font-bold"> </span>
        <span className="text-sm text-black font-medium">{nameFormatter(lastName)}</span>
      </div>
      {taskWorkers.map(work => {
        return (
          <div className="flex flex-col mt-1 p-1">
            <div className="flex flex-row justify-center items-center">
              <div className="text-small w-48 mr-2">Эмч нар</div>
              <div className="w-full">
                <Divider />
              </div>
            </div>
            <div className="">
              <div className="flex flex-row justify-start items-center">
                <div className="flex flex-wrap">
                  <div className="mb-1 mr-3">
                    {work.operation.lastName[0]}.{work.operation.firstName},
                  </div>
                  <div className="mb-1 mr-3">
                    {work.firstHelper.lastName[0]}.{work.firstHelper.firstName},
                  </div>
                  <div className="mb-1 mr-3">
                    {work.secondHelper.lastName[0]}.{work.secondHelper.firstName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="px-2">
        <Divider
          dashed={true}
          orientationMargin={3}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', marginBottom: 10 }}
        />
        <div className="flex justify-between items-center flex-row">
          <div>
            Тасаг:{' '}
            <span className="font-bold">{authorDep.shortName ? authorDep.shortName : '?'}</span>
          </div>
          <div>
            Өрөө: <span className="font-bold">{room?.number || '?'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

TaskCard.defaultProps = {
  id: 1,
  lastName: 'Баасансүрэн',
  firstName: 'Ган-Эрдэнэ',
  durationTime: '10:00',
  endTime: '22:00',
  timer: false,
};

export default TaskCard;
