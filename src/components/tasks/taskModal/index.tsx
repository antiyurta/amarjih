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
  const { user } = useAuthState();
  const companyId = user.response.companyId * 1;

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
  const [type, setSurgeryType] = useState('2');

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
    await userService.getList(`?search=${searchValue}&limit=200`).then((result: Response) => {
      setUsers(result.response.data);
    });
  };

  useEffect(() => {
    getUsers();
    if (props.itemId === 0) return;
    taskService.getOne(props.itemId).then((result: Response) => {
      setFirstName(result.response.firstName);
      setLastName(result.response.lastName);
      setSurgeryType(result.response.type);

      // const tempWorkers = [];

      const workers = result.response.taskWorkers;

      setOperationIds(workers?.map(worker => worker.operation.id));
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
      message.error('Талбаруудыг бүрэн бөглөнө үү!');
      setButtonLoading(false);
      return;
    }

    const res = await props.onFinish(props.itemId, {
      companyId,
      lastName,
      firstName,
      type,
      workers: operationIds?.map(operationId => ({
        operationId: operationId,
      })),
    });
  };

  const onClose = () => {
    setButtonLoading(false);
    props.close();
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
          <div className="flex justify-center">
            {activeKey === '1' && (
              <div className="p-3">
                <div className="flex justify-center">
                  <div className="flex flex-row">
                    <div className="p-2">
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

                      <div className="mb-2">
                        <CustomSelect
                          label="Тасгийн төрөл"
                          items={taskTypes.map(item => ({ id: item.value, name: item.label }))}
                          value={type}
                          onChange={e => setSurgeryType(e)}
                        />
                      </div>
                      <div className="mb-2">
                        <div className="block text-sm text-black mb-1">Баг бүрэлдэхүүн</div>
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
                          filterOption={(input, option) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                          }
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
