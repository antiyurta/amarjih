import React, { useState, useEffect, useRef } from 'react';
import { Form, AutoComplete, Modal, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Select } from 'antd';

import ContenWrapper from './style';

// services
import userService from '@services/user';
import taskService from '@services/task';
import directoryService from '@services/directory';

// components
import CustomSelect from '@components/common/select';

// constant
import { anesthesiaTypes } from '@datas/constants';

interface Response {
  response: any;
  success: boolean;
  message: string;
}

export default function SurgeryBox(props) {
  const usersRef = useRef(null);
  const surgeryRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [datas, setData] = useState(props.initData || {});
  const [surgeries, setSurgeries] = useState([]);
  const [surgery, setSurgeryId] = useState({
    id: props.surgery?.id || 0,
    name: props.surgery?.name || '',
  });
  const [operation, setOperationId] = useState({
    id: props.operation?.id || 0,
    name: props.operation?.firstName || '',
  });
  const [firstHelper, setFirstHelperId] = useState({
    id: props.firstHelper?.id || 0,
    name: props.firstHelper?.firstName || '',
  });
  const [secondHelper, setSecondHelperId] = useState({
    id: props.secondHelper?.id || 0,
    name: props.secondHelper?.firstName || '',
  });
  const [anesType, setAnesType] = useState(props.anesType);

  useEffect(() => {
    // getUsers();
    // getRecentUsers('operation');
    getSurgeries();
  }, []);

  const getSurgeries = async () => {
    directoryService.getList('?companyId=1').then((result: Response) => {
      const tempSurgeries = [];
      for (let i = 0; i < result.response?.data?.length; i++) {
        if (result?.response.data[i].type === 2) {
          tempSurgeries.push({
            id: result?.response.data[i].id,
            value: result?.response.data[i].name,
            label: result?.response.data[i].name,
          });
        }
      }
      surgeryRef.current = tempSurgeries;
      setSurgeries(tempSurgeries);
    });
  };

  const getUsers = async (searchValue = null) => {
    userService.getList(`?limit=50&search=${searchValue}`).then((result: Response) => {
      const tempUsers = [];
      for (let i = 0; i < result.response?.data?.length; i++) {
        tempUsers.push({
          id: result?.response.data[i].id,
          value: result?.response.data[i].firstName,
          label: result?.response.data[i].firstName,
        });
      }
      usersRef.current = tempUsers;
      setUsers(tempUsers);
    });
  };

  const getRecentUsers = async (role = 'operation') => {
    taskService.getRecentUsers(`?limit=25&role=${role}`).then((result: Response) => {
      const tempUsers = [];
      for (let i = 0; i < result.response?.length; i++) {
        tempUsers.push({
          id: result?.response[i].id,
          value: result?.response[i].firstName,
          label: result?.response[i].firstName,
        });
      }
      usersRef.current = tempUsers;
      setUsers(tempUsers);
    });
  };

  const handleClickEmptyButton = async e => {
    const res: any = await directoryService.addDirectory({
      name: e.name,
      type: 2,
      companyId: 1,
      code: '001',
    });

    surgeryRef.current = [
      ...surgeryRef.current,
      {
        id: res?.response.id,
        label: res?.response.name,
        value: res.response.name,
      },
    ];

    await handleSearchInput(res?.response.name);
  };

  const handleSearchInput = async e => {
    console.log('searching: ', e);
    if (e === '' || e === null) return;
    const searchedItems = surgeryRef.current.filter(word => {
      return word.label.includes(e);
    });

    setSurgeries(searchedItems);
  };

  const handleSearchUserInput = async e => {
    await getUsers(e);
  };

  const handleChangeSurgeryId = async (e, option) => {
    setSurgeryId({
      id: option.id,
      name: e,
    });
    props.setData({
      id: props.id,
      surgeryId: option.id,
      operationId: operation.id,
      firstHelperId: firstHelper.id,
      secondHelperId: secondHelper.id,
      number: props.number,
      tabKey: props.tabKey,
      anesType,
    });
  };

  const handleSelectSurgery = async (e, option) => {
    setSurgeryId({
      id: option.id,
      name: option.value,
    });
    props.setData({
      id: props.id,
      surgeryId: option.id,
      operationId: operation.id,
      firstHelperId: firstHelper.id,
      secondHelperId: secondHelper.id,
      number: props.number,
      tabKey: props.tabKey,
      anesType,
    });
  };

  const handleChangeOperationId = async (e, option) => {
    setOperationId({
      id: option.id,
      name: e,
    });
    props.setData({
      id: props.id,
      surgeryId: surgery.id,
      operationId: option.id,
      firstHelperId: firstHelper.id,
      secondHelperId: secondHelper.id,
      number: props.number,
      tabKey: props.tabKey,
      anesType,
    });
    setUsers(usersRef.current);
  };

  const handleChangeFirstId = async (e, option) => {
    setFirstHelperId({
      id: option.id,
      name: e,
    });
    props.setData({
      id: props.id,
      surgeryId: surgery.id,
      operationId: operation.id,
      firstHelperId: option.id,
      secondHelperId: secondHelper.id,
      number: props.number,
      tabKey: props.tabKey,
      anesType,
    });
    setUsers(usersRef.current);
  };

  const handleChangeSecondId = async (e, option) => {
    setSecondHelperId({
      id: option.id,
      name: e,
    });
    props.setData({
      surgeryId: surgery.id,
      operationId: operation.id,
      firstHelperId: firstHelper.id,
      secondHelperId: option.id,
      number: props.number,
      tabKey: props.tabKey,
      anesType,
    });
    setUsers(usersRef.current);
  };

  const handleChangeType = async e => {
    setAnesType(e);
    props.setData({
      id: props.id,
      surgeryId: surgery.id,
      operationId: operation.id,
      firstHelperId: firstHelper.id,
      secondHelperId: secondHelper.id,
      number: props.number,
      tabKey: props.tabKey,
      anesType: e,
    });
  };

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  return (
    <div className="flex justify-center">
      <ContenWrapper>
        <div className="p-3">
          <div className="mb-2">
            <div className="block text-xs text-gray mb-1">Мэс засал *</div>
            <AutoComplete
              options={surgeries}
              notFoundContent={
                <Button
                  type="primary"
                  onClick={() => handleClickEmptyButton(surgery)}
                  icon={<PlusOutlined />}
                >
                  {surgery.name}
                </Button>
              }
              style={{ width: 240 }}
              onSearch={handleSearchInput}
              onChange={handleChangeSurgeryId}
              onSelect={handleSelectSurgery}
              value={surgery.name}
            ></AutoComplete>
          </div>
          <div className="mb-2">
            <div className="mb-2">
              <CustomSelect
                label="Мэдээгүйжүүлэг"
                items={anesthesiaTypes}
                value={anesType}
                onChange={handleChangeType}
              />
            </div>
          </div>
          <div className="mb-2">
            <div className="block text-xs text-gray mb-1">Оператор *</div>
            <AutoComplete
              options={users}
              style={{ width: 240 }}
              onSearch={handleSearchUserInput}
              onChange={handleChangeOperationId}
              onSelect={handleChangeOperationId}
              onFocus={() => getRecentUsers('operation')}
              value={operation.name}
            ></AutoComplete>
          </div>
          <div className="mb-2">
            <div className="block text-xs text-gray mb-1">Нэгдүгээр туслах</div>
            <AutoComplete
              options={users}
              style={{ width: 240 }}
              onSearch={handleSearchUserInput}
              onChange={handleChangeFirstId}
              onSelect={handleChangeFirstId}
              onFocus={() => getRecentUsers('firsthelper')}
              value={firstHelper.name}
            ></AutoComplete>
          </div>
          <div className="mb-2">
            <div className="block text-xs text-gray mb-1">Хоёрдугаар туслах</div>
            <AutoComplete
              options={users}
              style={{ width: 240 }}
              onSearch={handleSearchUserInput}
              onChange={handleChangeSecondId}
              onSelect={handleChangeSecondId}
              onFocus={() => getRecentUsers('secondhelper')}
              value={secondHelper.name}
            ></AutoComplete>
          </div>
        </div>
      </ContenWrapper>
    </div>
  );
}
