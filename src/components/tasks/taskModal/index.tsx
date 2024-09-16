import { Form, AutoComplete, Modal, Button, message } from 'antd';
import moment from 'moment';
import { Tabs, Select } from 'antd';
import React, { useState, useEffect, useRef } from 'react';

import ContenWrapper from './style';

// services
import directoryService from '@services/directory';
import taskService from '@services/task';
import companyService from '@services/company';
import userService from '@services/user';

// components
import CustomButton from '@components/common/button';
import TextField from '@components/common/TextField';
import CustomSelect from '@components/common/select';
import CustomDatePicker from '@components/common/datepicker';
import SurgeryBox from './surgeryBox';

// context
import { useAuthState } from '@context/auth';
import { taskTypes } from '@utils/static-data';

interface Response {
  response: any;
  success: boolean;
  message: string;
}

const timeFormatter = value => {
  const arr = value.split(':');
  const formatted = `${arr[0]}:${arr[1]}`;
  return formatted;
};

export default function TaskModal(props) {
  const { isAuthenticated, setLogout, user } = useAuthState();
  const companyId = user.response.companyId * 1;
  const depId = user.response.depId;

  const surgeryTypes = [
    {
      id: 1,
      name: 'Төлөвлөгөөт',
    },
    {
      id: 2,
      name: 'Яаралтай',
    },
    {
      id: 3,
      name: 'Эмчилгээ',
    },
  ];

  const repeatTypes = [
    {
      id: 1,
      name: 'Анх',
    },
    {
      id: 2,
      name: 'Давтан',
    },
    {
      id: 3,
      name: 'Эмийн',
    },
  ];

  //amara
  const usersRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [operation, setOperationId] = useState({
    id: props.operation?.id || 0,
    name: props.operation?.firstName || '',
  });
  //

  const [form] = Form.useForm();
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [operationIds, setOperationIds] = useState([]);

  const [registerNumber, setRegNumber] = useState('');

  const [diagnoseId, setDiagnoseId] = useState(0);
  const [diagnoseName, setDiagnoseName] = useState('');
  const [type, setSurgeryType] = useState('2');
  const [isRepeat, setRepeatType] = useState(1);

  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [durationTime, setDurationTime] = useState('00:00');
  const [durationHour, setDurationHour] = useState(0);
  const [durationMinute, setDurationMinute] = useState(0);

  const [icdSearch, setIcdSearch] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);

  const [buttonLoading, setButtonLoading] = useState(false);

  const workRef = useRef([]);

  const initialItems = [
    { label: 'Үндсэн мэдээлэл', children: null, key: '1', closable: false },
    {
      label: 'Бүртгэл',
      children: (
        <SurgeryBox
          number={1}
          tabKey="2"
          setData={data => {
            handleChangeWorks(data);
          }}
        />
      ),
      key: '2',
      closable: false,
    },
  ];

  const handleChangeWorks = async work => {
    const tabIndex = workRef.current.findIndex(item => item.number === work.number);

    if (tabIndex === -1) {
      const newArr = [...workRef.current, work];
      workRef.current = newArr;
    } else {
      const newState = workRef.current.map(obj => {
        if (obj.number === work.number) {
          return work;
        }
        return obj;
      });

      workRef.current = newState;
    }
  };

  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);

  const getUsers = async (searchValue = null) => {
    await userService.getList(`?search=${searchValue}`).then((result: Response) => {
      // const tempUsers = [];
      // for (let i = 0; i < result.response?.data?.length; i++) {
      //   tempUsers.push({
      //     id: result?.response.data[i].id,
      //     value: result?.response.data[i].id,
      //     label: result?.response.data[i].firstName,
      //   });
      // }
      // usersRef.current = tempUsers;
      setUsers(result.response.data);
    });
  };

  useEffect(() => {
    getUsers();
    companyService.getMyComInfo().then((result: Response) => {
      setDurationHour(Math.floor(result.response.taskAverageTime / 60));
    });
    if (props.itemId === 0) return;
    taskService.getOne(props.itemId).then((result: Response) => {
      setFirstName(result.response.firstName);
      setLastName(result.response.lastName);
      // setRegNumber(result.response.registerNumber);
      // setIcdSearch(result.response?.diagnose.code);
      // setDiagnoseName(result.response?.diagnose.name);
      setSurgeryType(result.response.type);
      // setRepeatType(result.response.isRepeat);
      // setStartDate(result.response.startDate);
      // setDurationTime(result.response.durationTime);
      // setDurationHour(Math.floor(result.response.durationIntTime / 60));
      // setDurationMinute(result.response.durationIntTime % 60);

      // const tempWorkers = [];

      const workers = result.response.taskWorkers;

      setOperationIds(workers?.map(worker => worker.operation.id));

      // for (let i = 0; i < workers.length; i++) {
      //   tempWorkers.push({
      //     number: i + 1,
      //     id: result.response.taskWorkers[i].id,
      //     taskId: result.response.taskWorkers[i].taskId,
      //     surgeryId: result.response.taskWorkers[i].surgeryId,
      //     operationId: result.response.taskWorkers[i].operationId,
      //     firstHelperId: result.response.taskWorkers[i].firstHelperId,
      //     secondHelperId: result.response.taskWorkers[i].secondHelperId,
      //     anesType: result.response.taskWorkers[i].anesType,
      //   });
      // }
      // workRef.current = tempWorkers;

      // const editInitTabs = [
      //   { label: 'Үндсэн мэдээлэл', children: null, key: '1', closable: false },
      // ];

      // for (let i = 0; i < workers.length; i++) {
      //   const newActiveKey = `newTab${i}`;
      //   editInitTabs.push({
      //     label: 'Бүртгэл',
      //     children: (
      //       <SurgeryBox
      //         number={i + 1}
      //         key={newActiveKey}
      //         tabKey={newActiveKey}
      //         id={workers[i].id}
      //         surgery={workers[i].surgery}
      //         operation={workers[i].operation}
      //         firstHelper={workers[i].firstHelper}
      //         secondHelper={workers[i].secondHelper}
      //         anesType={workers[i].anesType}
      //         setData={handleChangeWorks}
      //       />
      //     ),
      //     key: newActiveKey,
      //     closable: true,
      //   });
      // }
      // setItems(editInitTabs);
    });
  }, [props.itemId]);

  useEffect(() => {
    if (icdSearch === null || icdSearch === '' || icdSearch.length < 2) return;
    directoryService
      .getIcd10List(`?code=${icdSearch}&description=long`)
      .then((result: Response) => {
        if (result.success) {
          const temp = [];
          result.response.data.map(item => {
            temp.push({
              id: item.id,
              value: item.name,
              label: '(' + item.code + ') ' + item.name,
            });
          });
          setDiagnoses(temp);
        } else setDiagnoses([]);
      });
  }, [icdSearch]);

  const onChangeDatePicker = async dateString => {
    setStartDate(dateString);
  };

  const onChangeStartTimePicker = timeString => {
    setDurationTime(timeString);
  };

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: 'Бүртгэл',
      children: (
        <SurgeryBox
          number={newTabIndex.current + 1}
          tabKey={newActiveKey}
          key={newActiveKey}
          setData={handleChangeWorks}
        />
      ),
      key: newActiveKey,
      closable: true,
    });

    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: string) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter(item => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    let tabIndex = workRef.current.findIndex(item => item.tabKey === targetKey);
    workRef.current.splice(tabIndex, 1);

    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (targetKey: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  const onFinish = async values => {
    setButtonLoading(true);
    if (lastName.length === 0 || firstName.length === 0) {
      // if (lastName.length === 0 || firstName.length === 0 || workRef.current.length === 0) {
      message.error('Талбаруудыг бүрэн бөглөнө үү!');
      setButtonLoading(false);
      return;
    }
    // else if (registerNumber.length !== 10) {
    //   message.error('Регистрийн дугаар буруу байна!');
    //   setButtonLoading(false);
    //   return;
    // }
    // else if (diagnoses.length === 0) {
    //   message.error('Онош буруу байна!');
    //   setButtonLoading(false);
    //   return;
    // }

    // const workers = [];
    // for (let i = 0; i < workRef.current.length; i++) {
    //   workers.push({
    //     id: workRef.current[i].id,
    //     taskId: workRef.current[i].taskId,
    //     surgeryId: workRef.current[i].surgeryId,
    //     operationId: workRef.current[i].operationId,
    //     firstHelperId: workRef.current[i].firstHelperId,
    //     secondHelperId: workRef.current[i].secondHelperId,
    //     anesType: workRef.current[i].anesType,
    //   });
    // }

    const res = await props.onFinish(props.itemId, {
      companyId,
      lastName,
      firstName,
      // registerNumber,
      // diagnoseId: diagnoses.length ? diagnoses[0].id : 0,
      type,
      // startDate,
      // durationTime,
      // durationIntTime: durationHour * 60 + durationMinute,
      // isRepeat,
      workers: operationIds?.map(operationId => ({
        operationId: operationId,
      })),
    });
  };

  const handleRegisterInput = async e => {
    if (e.length === 10 && props.itemId === 0) {
      const row: any = await taskService.getList('?registerNumber=' + e);
      if (row?.response?.data?.length) {
        setLastName(row?.response?.data[0].lastName);
        setFirstName(row?.response?.data[0].firstName);
        setRepeatType(2);
      }
    }
    setRegNumber(e);
  };

  const mockVal = (str: string, repeat = 1) => ({
    value: str.repeat(repeat),
  });

  const onSearchIcd = (searchText: string) => {
    setIcdSearch(searchText);
  };

  const onChangeIcd = (data: string) => {
    setDiagnoseName(data);
  };

  const onClose = () => {
    setButtonLoading(false);
    props.close();
  };

  const handleSearchUserInput = async e => {
    await getUsers(e);
  };

  const handleChangeOperationId = async (e, option) => {
    setOperationId({
      id: option.id,
      name: e,
    });
    props.setData({
      id: props.id,
      // surgeryId: surgery.id,
      operationId: option.id,
      // firstHelperId: firstHelper.id,
      // secondHelperId: secondHelper.id,
      number: props.number,
      tabKey: props.tabKey,
      // anesType,
    });
    setUsers(usersRef.current);
  };

  return (
    <Modal
      open={props.isModalVisible}
      destroyOnClose={true}
      onCancel={onClose}
      centered
      width={`fitContent`}
      bodyStyle={{
        height: 610,
        minWidth: 500,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      title={
        <div className="font-bold text-xl">
          {props.itemId > 0 ? 'БҮРТГЭЛ ЗАСАХ' : 'БҮРТГЭЛ НЭМЭХ'}
        </div>
      }
      footer={
        <div className="flex h-14 justify-end items-center">
          <div className="ml-2">
            <CustomButton color="gray" name="Цонхыг хаах" onClick={onClose} />
          </div>
          <div className="ml-2">
            <Button type="primary" loading={buttonLoading} onClick={onFinish}>
              Хадгалах
            </Button>
          </div>
        </div>
      }
    >
      <ContenWrapper>
        <Form name="register" onFinish={onFinish}>
          {/* <Tabs
            type="editable-card"
            onChange={onChange}
            activeKey={activeKey}
            onEdit={onEdit}
            items={items}
          /> */}
          <div className="flex justify-center">
            {activeKey === '1' && (
              <div className="p-3">
                <div className="flex justify-center">
                  <div className="flex flex-row">
                    <div className="p-2">
                      {/* <div className="mb-2">
                        <TextField
                          label="Регистрийн дугаар *"
                          value={registerNumber}
                          onChange={handleRegisterInput}
                        />
                      </div> */}
                      <div className="mb-2">
                        <TextField label="Овог *" value={lastName} onChange={e => setLastName(e)} />
                      </div>
                      <div className="mb-2">
                        <TextField
                          label="Нэр *"
                          value={firstName}
                          onChange={e => setFirstName(e)}
                        />
                      </div>
                      {/* <div className="mb-2">
                        <CustomSelect
                          label="Давтан эсэх"
                          items={repeatTypes}
                          value={isRepeat}
                          onChange={e => setRepeatType(e)}
                        />
                      </div> */}
                      {/* <div className="mb-2">
                        <div className="block text-xs text-gray mb-1">Онош *</div>
                        <AutoComplete
                          allowClear={true}
                          options={diagnoses}
                          style={{ width: 240 }}
                          onSearch={onSearchIcd}
                          onChange={onChangeIcd}
                          value={diagnoseName}
                        ></AutoComplete>
                      </div> */}
                      <div className="mb-2">
                        <CustomSelect
                          label="Тасгийн төрөл"
                          // label="Мэс заслын төрөл"
                          // items={surgeryTypes}
                          items={taskTypes.map(item => ({ id: item.value, name: item.label }))}
                          value={type}
                          onChange={e => setSurgeryType(e)}
                        />
                      </div>
                      {/* <div className="w-60 mb-2">
                        <div className="block text-xs text-gray">Огноо</div>
                        <div className="mt-1 w-60">
                          <CustomDatePicker onChange={onChangeDatePicker} value={startDate} />
                        </div>
                      </div> */}
                      {/* <div className="mb-2 flex flex-row">
                        <div className="w-30 mr-2">
                          <div className="block text-xs text-gray mb-1 mt-2">
                            Үргэжлэх хугацаа /Төлөвлөгөөт/
                          </div>
                          <div className="flex flex-row w-30 justify-start">
                            <div className="w-30 mb-2">
                              <Select
                                value={durationHour}
                                placeholder="Цаг"
                                style={{ width: 120 }}
                                onChange={e => setDurationHour(e)}
                                options={[
                                  { value: 0, label: '00 цаг' },
                                  { value: 1, label: '1 цаг' },
                                  { value: 2, label: '2 цаг' },
                                  { value: 3, label: '3 цаг' },
                                  { value: 4, label: '4 цаг' },
                                  { value: 5, label: '5 цаг' },
                                  { value: 6, label: '6 цаг' },
                                  { value: 7, label: '7 цаг' },
                                  { value: 8, label: '8 цаг' },
                                  { value: 9, label: '9 цаг' },
                                  { value: 10, label: '10 цаг' },
                                  { value: 11, label: '11 цаг' },
                                  { value: 12, label: '12 цаг' },
                                ]}
                              />
                            </div>
                            <div className="w-30 mb-2 ml-2">
                              <Select
                                value={durationMinute}
                                placeholder="Минут"
                                style={{ width: 112 }}
                                onChange={e => setDurationMinute(e)}
                                options={[
                                  { value: 0, label: '00 минут' },
                                  { value: 10, label: '10 минут' },
                                  { value: 15, label: '15 минут' },
                                  { value: 20, label: '20 минут' },
                                  { value: 25, label: '25 минут' },
                                  { value: 30, label: '30 минут' },
                                  { value: 35, label: '35 минут' },
                                  { value: 40, label: '40 минут' },
                                  { value: 45, label: '45 минут' },
                                  { value: 50, label: '50 минут' },
                                  { value: 55, label: '55 минут' },
                                ]}
                              />
                            </div>
                          </div>
                        </div>
                      </div> */}
                      <div className="mb-2">
                        <div className="block text-xs text-gray mb-1">Баг бүрэлдэхүүн</div>
                        <Select
                          mode="multiple"
                          onChange={value => {
                            console.log(value);
                            setOperationIds(value);
                          }}
                          value={operationIds}
                          style={{ width: 240, height: 'auto' }}
                          options={users?.map(user => ({
                            label: `${user.lastName}|${user.firstName}`,
                            value: user.id,
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Form>
      </ContenWrapper>
    </Modal>
  );
}
