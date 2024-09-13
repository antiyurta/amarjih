import { Form, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Divider, Steps } from 'antd';

// services
import roomService from '@services/room';
import userService from '@services/user';
import columnService from '@services/column';
import taskService from '@services/task';

// components
import Button from '@components/common/button';
import UserIconRow from '@components/common/userRow';
import { getColumn, getTypeInfo } from '@utils/util';
import CustomSteps from '@components/common/step';

interface Response {
  response: any;
  success: boolean;
  message: string;
}

export default function ColumnChangeModal(props) {
  const companyId = 1;

  const [users, setUsers] = useState([]);
  const [task, setTask] = useState(null);
  const [columns, setColumns] = useState([]);

  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    setCurrent(value);
  };

  useEffect(() => {
    getTask();
  }, []);

  // useEffect(() => {
  //   const currentIndex = columns.findIndex(column => column.id === task.currentColumn?.column.id);
  //   console.log('columns', columns);
  //   if (currentIndex !== -1) {
  //     setCurrent(currentIndex);
  //   } else {
  //     setCurrent(0);
  //   }
  //   const tempColumns = [];
  //   columns.map((col, ind) => {
  //     if (currentIndex + 1 < ind && currentIndex < 4) {
  //       Object.assign(col, { disabled: true });
  //     }
  //     tempColumns.push(col);
  //   });
  //   setColumns(tempColumns);
  // }, [task]);

  const getTask = async () => {
    const result: any = await taskService.getOne(props.itemId);
    setTask(result.response);
    getColumns(result.response);
  };

  const getColumns = async (task: any) => {
    const columns = getColumn(task.type)
      .filter(item => item.isContextMenu)
      .map(item => {
        return {
          id: item.id,
          title: item.columnName,
          description: item.isCheckRequired ? 'required' : 'direct',
          isCheckRequired: item.isCheckRequired,
        };
      });
    const currentIndex = columns.findIndex(column => column.id === task.currentColumn?.column.id);
    if (currentIndex !== -1) {
      setCurrent(currentIndex);
    } else {
      setCurrent(0);
    }
    const tempColumns = [];
    columns.map((col, ind) => {
      if (currentIndex + 1 < ind && currentIndex < 4) {
        Object.assign(col, { disabled: true });
      }
      tempColumns.push(col);
    });
    setColumns(tempColumns);

    // const result: any = await columnService.getList({ taskType: 1 });
    // const stepItems = result.response?.data
  };

  const onFinish = async values => {
    const res = await props.onFinish({
      companyId,
      columnId: columns[current].id,
      taskId: task.id,
      description: 'Төлөв солив',
    });
    onClose();
  };

  const onClose = () => {
    props.close();
  };

  return (
    <Modal
      open={props.isModalVisible}
      onCancel={onClose}
      width={820}
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
      title={<div className="font-bold text-xl">ТӨЛӨВ СОЛИХ ЦОНХ</div>}
    >
      <div className="">
        <Form name="changeColumnForm" onFinish={onFinish}>
          <div className="flex flex-row">
            <div className="flex items-center flex-col p-4 w-[400px]">
              <div className="p-1">
                <div className="flex flex-row justify-start items-center py-1">
                  <div className="text-sm w-40">Дугаар</div>
                  <div className="text-sm font-bold">{task?.id}</div>
                </div>
                <div className="flex flex-row justify-start items-center py-1">
                  <div className="text-sm w-40">Овог</div>
                  <div className="text-sm font-bold">{task?.firstName}</div>
                </div>
                <div className="flex flex-row justify-start items-center py-1">
                  <div className="text-sm w-40">Нэр</div>
                  <div className="text-sm font-bold">{task?.lastName}</div>
                </div>
                {/* <div className="flex flex-row justify-start items-center py-1">
                  <div className="text-sm w-40">Регистрийн дугаар</div>
                  <div className="text-sm font-bold">{task?.registerNumber}</div>
                </div> */}
                {/* <div className="flex flex-row justify-start items-center py-1">
                  <div className="text-sm w-40">Онош</div>
                  <div className="text-sm font-bold">{task?.diagnose?.name}</div>
                </div> */}
                <div className="flex flex-row justify-start items-center py-1">
                  <div className="text-sm w-40">Төрөл</div>
                  <div className="text-sm font-bold">
                    {getTypeInfo(task?.type || 2)}
                    {/* {task?.type === 2 ? 'Яаралтай' : 'Төлөвлөгөөт'} */}
                  </div>
                </div>
                {/* <div className="flex flex-row justify-start items-center py-1">
                  <div className="text-sm w-40">Давтан эсэх</div>
                  <div className="text-sm font-bold">{task?.isRepeat === 2 ? 'Тийм' : 'Үгүй'}</div>
                </div> */}
                <div className="flex flex-row justify-start items-center py-1">
                  <div className="text-sm w-40">Огноо</div>
                  <div className="text-sm font-bold">
                    {moment(task?.createdAt).format('YYYY/MM/DD')}
                  </div>
                </div>
                {/* <div className="flex flex-row justify-start items-center py-1">
                  <div className="text-sm w-40">Үргэжлэх хугацаа</div>
                  <div className="text-sm font-bold">{task?.durationIntTime} минут</div>
                </div> */}
                {task?.taskWorkers.map(work => {
                  return (
                    <div className="flex flex-col mt-4">
                      {/* <div className="flex flex-row justify-start items-center">
                        <div className="text-base w-56 mr-2 font-bold">Мэс засал</div>
                      </div> 
                      <div className="text-sm mt-2">{work.surgery.name}</div> */}
                      <div className="flex flex-row justify-center items-center">
                        <div className="text-base w-56 mr-2 font-bold">Эмч нар</div>
                        <div className="w-full">
                          <Divider />
                        </div>
                      </div>
                      <div className="">
                        <div className="flex flex-row justify-start items-center p-1">
                          <div className="flex flex-row ">
                            <div className="mb-3 mr-3">
                              <UserIconRow data={work.operation} />
                            </div>
                            {/* <div className="mb-3 mr-3">
                              {work.firstHelper ? <UserIconRow data={work.firstHelper} /> : ''}
                            </div>
                            <div className="mb-3 mr-3">
                              {work.secondHelper ? <UserIconRow data={work.secondHelper} /> : ''}
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* <div className="flex flex-col mt-1">
                  <div className="flex flex-row justify-center items-center">
                    <div className="text-base w-56 mr-2 font-bold">Мэдээгүйжүүлэгч</div>
                    <div className="w-full">
                      <Divider />
                    </div>
                  </div>
                  {task?.taskDoctorRels?.length > 0 && (
                    <div className="">
                      <div className="flex flex-row justify-start p-1">
                        <div className="flex flex-row text-sm">
                          {task?.taskDoctorRels?.map(item => {
                            return (
                              <div className="mb-3 mr-3">
                                <UserIconRow data={item.user} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div> */}
              </div>
            </div>
            <Divider type="vertical" style={{ height: 500 }} />
            <div className="p-4">
              <CustomSteps
                columns={[
                  {
                    id: 1,
                    parentId: null,
                    name: 'Эрэмбэлэлт хийгдэж байна',
                  },
                  {
                    id: 2,
                    parentId: null,
                    name: 'Эмчийн үзлэг хийгдэж байна',
                  },
                  {
                    id: 3,
                    parentId: 2,
                    name: 'Хяналт хийгдэж байна',
                  },
                  {
                    id: 7,
                    parentId: 3,
                    name: 'Эмчийн үзлэг хийгдэж байна',
                  },
                  {
                    id: 4,
                    parentId: 2,
                    name: 'Яаралтай кесаров хагалгаагаар төрөх',
                  },
                  {
                    id: 5,
                    parentId: 4,
                    name: 'Хагалгааны өмнөх өрөө',
                  },
                  {
                    id: 6,
                    parentId: 2,
                    name: 'Эрсдэлтэй жирэмсний эмгэгийг эмчлэх тасаг',
                  },
                ]}
              />
              <Steps current={current} onChange={onChange} direction="vertical" items={columns} />
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
