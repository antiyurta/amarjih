import { Form, Modal, Radio, Select } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Divider, Steps } from 'antd';

// services
import columnService from '@services/column';
import taskService from '@services/task';

// components
import Button from '@components/common/button';
import UserIconRow from '@components/common/userRow';
import { taskTypes } from '@utils/static-data';
import CustomSelect from '@components/common/select';
import RoomService from '@services/room';

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
  const [currentColumns, setCurrentColumns] = useState([]);
  const [current, setCurrent] = useState(0);
  const [columnId, setColumnId] = useState<number>();
  const [roomId, setRoomId] = useState();
  const [rooms, setRooms] = useState([]);

  const onChange = (value: number) => {
    setCurrent(value);
  };
  useEffect(() => {
    getTask();
  }, []);

  useEffect(() => {
    if (task?.columnId) {
      getColumns();
    }
  }, [task?.columnId]);

  useEffect(() => {
    getListColumns();
    getRooms();
  }, [current, task?.type, columns]);

  useEffect(() => {
    getRooms();
  }, [columnId]);

  const getTask = async () => {
    const result: any = await taskService.getOne(props.itemId);
    setTask(result.response);
  };
  const getColumns = async () => {
    const result: any = await columnService.getParentList(task?.columnId);
    const stepItems =
      result.response.map(item => {
        return {
          id: item.id,
          title: item.columnName,
          description: item.isCheckRequired ? 'required' : 'direct',
          isCheckRequired: item.isCheckRequired,
        };
      }) || [];
    setCurrent(stepItems.findIndex(item => item.id == task?.columnId));
    setColumns(stepItems);
  };

  const getListColumns = async () => {
    if (task) {
      const result = await columnService.getList({
        taskType: task?.type,
        columnId: columns[current]?.id,
      });
      setCurrentColumns(result.response);
    }
  };

  const onFinish = async values => {
    const res = await props.onFinish({
      companyId,
      columnId: columnId,
      taskId: task.id,
      roomId: roomId,
      description: 'Төлөв солив',
    });
    onClose();
  };

  const onClose = () => {
    props.close();
  };
  const getRooms = async () => {
    if (columnId) {
      const result = await RoomService.getList({ columnId, limit: 50 });
      if (result?.success) {
        setRooms(result?.response?.data);
      }
    }
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
                    <Select disabled options={taskTypes} value={task?.type} />
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
                        <div className="text-base w-56 mr-2 font-bold">Бүртгэл</div>
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
              <Steps current={current} onChange={onChange} direction="vertical" items={columns} />
              <CustomSelect
                label="Явц"
                items={currentColumns}
                value={columnId}
                width="w-80"
                onChange={setColumnId}
              />
              <Radio.Group onChange={e => setRoomId(e.target.value)} value={roomId}>
                {rooms.map(item => (
                  <Radio key={item?.id} value={item?.id}>
                    {item?.name}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
