import { Form, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { AutoComplete, Select } from 'antd';
import 'antd/dist/antd.css';
const { Option } = Select;

// services
import roomService from '@services/room';
import userService from '@services/user';
import taskService from '@services/task';

// components
import Button from '@components/common/button';
import CustomSelect from '@components/common/select';

interface Response {
  response: any;
  success: boolean;
  message: string;
}

export default function NurseModal(props) {
  const companyId = 1;

  const [doctorUsers, setDoctorUsers] = useState([]);
  const [nurseUsers, setNurseUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);

  useEffect(() => {
    getRooms();
    getTask();
    getRecentNurses();
    getRecentDoctors();
  }, []);

  const getTask = async () => {
    const tempNurses = [];
    const tempDoctors = [];
    const result: any = await taskService.getOne(props.itemId);
    for (let i = 0; i < result.response?.taskNurseRels.length; i++) {
      tempNurses.push({
        id: result.response?.taskNurseRels[i].user.id,
        name: result.response?.taskNurseRels[i].user.firstName,
        label: result.response?.taskNurseRels[i].user.firstName,
        value: result.response?.taskNurseRels[i].user.id,
      });
    }

    for (let i = 0; i < result.response?.taskDoctorRels.length; i++) {
      tempDoctors.push({
        id: result.response?.taskDoctorRels[i].user.id,
        name: result.response?.taskDoctorRels[i].user.firstName,
        label: result.response?.taskDoctorRels[i].user.firstName,
        value: result.response?.taskDoctorRels[i].user.id,
      });
    }

    setNurses(tempNurses);
    setDoctors(tempDoctors);
    setRoomId(result.response.roomId);
  };

  const getRooms = async () => {
    const result: any = await roomService.getList('?companyId=1');
    const tempRooms = [];
    for (let i = 0; i < result.response?.data?.length; i++) {
      tempRooms.push({
        id: result?.response.data[i].id,
        name: result?.response.data[i].number,
      });
    }
    setRooms(tempRooms);
  };

  const getRecentNurses = async () => {
    setLoading(true);
    const result: any = await taskService.getRecentTaskUsers(`?role=nurses`);
    const tempUsers = [];
    for (let i = 0; i < result.response?.length; i++) {
      tempUsers.push({
        id: result?.response[i].id,
        name: result?.response[i].firstName,
        label: result?.response[i].firstName,
        value: `${result?.response[i].id}`,
      });
    }
    setNurseUsers(tempUsers);
    setLoading(false);
  };

  const getRecentDoctors = async () => {
    setLoading(true);
    const result: any = await taskService.getRecentTaskUsers(`?role=doctors`);
    const tempUsers = [];
    for (let i = 0; i < result.response?.length; i++) {
      tempUsers.push({
        id: result?.response[i].id,
        name: result?.response[i].firstName,
        label: result?.response[i].firstName,
        value: `${result?.response[i].id}`,
      });
    }
    setDoctorUsers(tempUsers);
    setLoading(false);
  };

  const getDoctorUsers = async (searchValue = null) => {
    setLoading(true);
    const result: any = await userService.getList(`?limit=50&search=${searchValue}`);
    const tempUsers = [];
    for (let i = 0; i < result.response?.data?.length; i++) {
      tempUsers.push({
        id: result?.response.data[i].id,
        name: result?.response.data[i].firstName,
        label: result?.response.data[i].firstName,
        value: `${result?.response.data[i].id}`,
      });
    }
    setDoctorUsers(tempUsers);
    setLoading(false);
  };

  const getNurseUsers = async (searchValue = null) => {
    const result: any = await userService.getList(`?limit=50&role=nurse&search=${searchValue}`);
    const tempUsers = [];
    for (let i = 0; i < result.response?.data?.length; i++) {
      tempUsers.push({
        id: result?.response.data[i].id,
        name: result?.response.data[i].firstName,
        label: result?.response.data[i].firstName,
        value: `${result?.response.data[i].id}`,
      });
    }
    setNurseUsers(tempUsers);
  };

  const handleSelectDoctor = async (e, option) => {
    setDoctors(prev => [
      ...prev,
      { id: e, name: option.children, label: option.children, value: e },
    ]);
  };

  const handleSearchDoctor = async value => {
    if (value.length > 1) await getDoctorUsers(value);
  };

  const handleDeselectDoctor = value => {
    const updatedDoctors = doctors.filter(doctor => doctor.value !== value);
    setDoctors(updatedDoctors);
  };

  const handleSelectNurse = async (e, option) => {
    setNurses(prev => [
      ...prev,
      { id: e, name: option.children, label: option.children, value: e },
    ]);
  };

  const handleSearchNurse = async value => {
    if (value.length > 1) await getNurseUsers(value);
  };

  const handleDeselectNurse = value => {
    const updatedNurses = nurses.filter(nurse => nurse.value !== value);
    setNurses(updatedNurses);
  };

  const onFinish = async values => {
    setButtonLoader(true);
    const res = await props.onFinish({
      companyId,
      columnId: 3,
      roomId,
      nurses,
      doctors,
      description: 'Мэдээлэл оруулав',
    });
    setButtonLoader(false);
    onClose();
  };

  const onClose = () => {
    setRoomId(0);
    setNurses([]);
    setDoctors([]);
    props.close();
  };

  return (
    <Modal
      open={props.isModalVisible}
      onCancel={onClose}
      width={520}
      centered
      footer={
        <div className="flex h-14 justify-end items-center">
          <div className="ml-2">
            <Button color="gray" name="Цонхыг хаах" onClick={onClose} />
          </div>
          <div className="ml-2">
            {buttonLoader ? (
              <Button color="loader" name="loading" />
            ) : (
              <Button name="Хадгалах" onClick={onFinish} />
            )}
          </div>
        </div>
      }
      title={<div className="font-bold text-xl">МЭДЭЭЛЭЛ НЭМЭХ</div>}
    >
      <div className="">
        <Form name="busBookingCheck" onFinish={onFinish}>
          <div className="flex justify-center items-center flex-col">
            <div className="mb-2 w-80">
              <CustomSelect
                label="Өрөөний дугаар"
                items={rooms}
                value={roomId}
                width="w-80"
                onChange={e => setRoomId(e)}
              />
            </div>
            <div className="mb-2">
              <div className="block text-xs text-gray mb-1 mt-3">Мэдээгүйжүүлэгч эмч</div>
              <Select
                showSearch
                mode="multiple"
                className={`w-80 bg-input text-black text-sm text-left`}
                onSelect={handleSelectDoctor}
                onSearch={handleSearchDoctor}
                onDeselect={handleDeselectDoctor}
                placeholder="Эмч сонгоно уу!"
                optionFilterProp="children"
                value={doctors}
                loading={loading}
                filterOption={false} // Disable local filtering
              >
                {doctorUsers.map(item => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
            <div className="mb-2">
              <div className="block text-xs text-gray mb-1 mt-3">Сувилагч</div>
              <Select
                showSearch
                mode="multiple"
                className={`w-80 bg-input text-black text-sm text-left`}
                onSelect={handleSelectNurse}
                onSearch={handleSearchNurse}
                onDeselect={handleDeselectNurse}
                placeholder="Сувилагч сонгоно уу!"
                optionFilterProp="children"
                value={nurses}
                loading={loading}
                filterOption={false} // Disable local filtering
              >
                {nurseUsers.map(item => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
