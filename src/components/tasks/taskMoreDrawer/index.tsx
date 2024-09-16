import React, { useState } from 'react';
import moment from 'moment';
import { Drawer, Divider, Tag, Timeline } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

// components
import UserIconRow from '@components/common/userRow';

interface Props {
  visible?: boolean;
  datas?: any;
  onClose?: Function;
}

const TaskMoreDrawer: React.FC<Props> = ({ visible, datas, onClose }) => {
  const [isVisible, setVisible] = useState(visible);

  const columns = datas.taskColumnsRels.sort((p1, p2) =>
    p1.id > p2.id ? 1 : p1.id < p2.id ? -1 : 0
  );

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  return (
    <>
      <Drawer
        title={null}
        placement={`right`}
        closable={false}
        open={isVisible}
        onClose={handleClose}
        key={`right`}
        width={680}
      >
        <CloseOutlined
          onClick={handleClose}
          style={{ fontSize: '22px', color: 'gray', cursor: 'pointer' }}
        />
        <div className="p-2">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center">
              <div className="text-2xl">Мэс заслын мэдээлэл</div>
            </div>
          </div>
          <div className="flex flex-col mt-6 p-2">
            <div className="flex flex-row justify-center items-center">
              <div className="text-base w-56 mr-2 font-bold">Үндсэн мэдээлэл</div>
              <div className="w-full">
                <Divider />
              </div>
            </div>
            <div className="p-2">
              <div className="flex flex-row justify-start items-center p-1">
                <div className="text-sm w-40">Дугаар</div>
                <div className="text-sm font-bold">{datas.id}</div>
              </div>
              <div className="flex flex-row justify-start items-center p-1">
                <div className="text-sm w-40">Овог</div>
                <div className="text-sm font-bold">{datas.firstName}</div>
              </div>
              <div className="flex flex-row justify-start items-center p-1">
                <div className="text-sm w-40">Нэр</div>
                <div className="text-sm font-bold">{datas.lastName}</div>
              </div>
              <div className="flex flex-row justify-start items-center p-1">
                <div className="text-sm w-40">Регистрийн дугаар</div>
                <div className="text-sm font-bold">{datas.registerNumber}</div>
              </div>
              <div className="flex flex-row justify-start items-center p-1">
                <div className="text-sm w-40">Онош</div>
                <div className="text-sm font-bold">{datas.diagnose.name}</div>
              </div>
              <div className="flex flex-row justify-start items-center p-1">
                <div className="text-sm w-40">Төрөл</div>
                <div className="text-sm font-bold">
                  {datas.type === 2 ? 'Яаралтай' : 'Төлөвлөгөөт'}
                </div>
              </div>
              <div className="flex flex-row justify-start items-center p-1">
                <div className="text-sm w-40">Давтан эсэх</div>
                <div className="text-sm font-bold">{datas.isRepeat === 2 ? 'Тийм' : 'Үгүй'}</div>
              </div>
              <div className="flex flex-row justify-start items-center p-1">
                <div className="text-sm w-40">Огноо</div>
                <div className="text-sm font-bold">
                  {moment(datas.startDate).format('YYYY/MM/DD')}
                </div>
              </div>
              <div className="flex flex-row justify-start items-center p-1">
                <div className="text-sm w-40">Үргэжлэх хугацаа</div>
                <div className="text-sm font-bold">{datas.durationTime}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-1 p-2">
            <div className="flex flex-row justify-center items-center">
              <div className="text-base w-56 mr-2 font-bold">Нэмсэн ажилтан</div>
              <div className="w-full">
                <Divider />
              </div>
            </div>
            <div className="p-2">
              <div className="flex flex-row justify-start p-1">
                <div className="flex flex-row text-sm">
                  <UserIconRow data={datas.author} />
                </div>
              </div>
            </div>
          </div>
          {datas.taskWorkers.map((work: any, index: number) => {
            return (
              <div key={index} className="flex flex-col mt-1 p-2">
                <div className="flex flex-row justify-start items-center p-1">
                  <div className="text-base w-40 font-bold">Бүртгэл</div>
                  <div className="text-sm font-bold">{work.surgery.name}</div>
                </div>
                <div className="p-1 flex flex-row justify-center items-center">
                  <div className="text-base w-56 mr-2">Эмч нар</div>
                  <div className="w-full">
                    <Divider />
                  </div>
                </div>
                <div className="p-2">
                  <div className="flex flex-row justify-start items-center p-1">
                    <div className="flex flex-row ">
                      <div className="mb-3 mr-3">
                        <UserIconRow data={work.operation} />
                      </div>
                      <div className="mb-3 mr-3">
                        {work.firstHelper ? <UserIconRow data={work.firstHelper} /> : ''}
                      </div>
                      <div className="mb-3 mr-3">
                        {work.secondHelper ? <UserIconRow data={work.secondHelper} /> : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex flex-col mt-1 p-2">
            <div className="flex flex-row justify-center items-center">
              <div className="text-base w-56 mr-2 font-bold">Мэдээгүйжүүлэгч</div>
              <div className="w-full">
                <Divider />
              </div>
            </div>
            {datas.taskDoctorRels.length > 0 && (
              <div className="p-2">
                <div className="flex flex-row justify-start p-1">
                  <div className="flex flex-row text-sm">
                    {datas.taskDoctorRels.map((item: any, index: number) => {
                      return (
                        <div key={index} className="mb-3 mr-3">
                          <UserIconRow data={item.user} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col mt-1 p-2">
            <div className="flex flex-row justify-center items-center">
              <div className="text-base w-56 mr-2 font-bold">Сувилагч нар</div>
              <div className="w-full">
                <Divider />
              </div>
            </div>
            {datas.taskNurseRels.length > 0 && (
              <div className="p-2">
                <div className="flex flex-row justify-start p-1">
                  <div className="flex flex-row text-sm">
                    {datas.taskNurseRels.map((item: any, index: number) => {
                      return (
                        <div key={index} className="mb-3 mr-3">
                          <UserIconRow data={item.user} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col mt-1 p-2">
            <div className="flex flex-row justify-center items-center">
              <div className="text-base w-56 mr-2 font-bold">Төлвийн түүх</div>
              <div className="w-full">
                <Divider />
              </div>
            </div>
            <Timeline>
              {columns.map((item: any, index: number) => {
                return (
                  <Timeline.Item key={index}>
                    {item.column.columnName}
                    <Tag
                      className="py-1 ml-5 px-4 w-fit"
                      style={{
                        borderRadius: 4,
                        textAlign: 'center',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      <div className="w-auto">
                        {moment(item.createdAt).format('YYYY/MM/DD hh:mm')}
                      </div>
                    </Tag>
                    {item.columnId === 8 && (
                      <Tag
                        className="py-1 px-4 w-fit"
                        style={{
                          borderRadius: 4,
                          textAlign: 'center',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}
                      >
                        <div className="w-auto">{item.description}</div>
                      </Tag>
                    )}
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default TaskMoreDrawer;
