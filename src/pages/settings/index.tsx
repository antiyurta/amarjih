import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { message, Tabs, Input } from 'antd';

import MoreLayout from '@components/layout/more';

import withAuth from '@hooks/hoc';

// components
import Button from '@components/common/button';
import DepCard from '@components/settings/depCard';
import DepModal from '@components/settings/depModal';
import RoomCard from '@components/settings/roomCard';
import RoomModal from '@components/settings/roomModal';
import DescModal from '@components/settings/descModal';
// import TypeCard from '@components/settings/typeCard';
import TypeModal from '@components/settings/typeModal';
import TextField from '@components/common/TextField';

// services
import roomService from '@services/room';
import companyService from '@services/company';
import directoryService from '@services/directory';
import structureService from '@services/structure';

interface Response {
  response?: any;
  success?: boolean;
  message?: string;
}

const { TabPane } = Tabs;

const Settings = () => {
  const router = useRouter();
  const [choosedTab, setChoosedTab] = useState('1');
  const [rooms, setRooms] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [company, setComInfo] = useState({
    id: 0,
    name: null,
    email: null,
    taskStartTime: '00:00',
  });
  const [structures, setStructures] = useState([]);
  const [isReload, setReload] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [choosedItem, setChoosedItem] = useState(null);

  interface Response {
    response?: any;
    success?: boolean;
    message?: string;
  }

  useEffect(() => {
    if (choosedTab === '2')
      roomService.getList({ companyId: 1 }).then((result: Response) => {
        setRooms(result?.response?.data);
      });
    else if (choosedTab === '1') {
      structureService.getList('?type=1').then((result: Response) => {
        setStructures(result?.response?.data);
      });
    } else if (choosedTab === '3') {
      companyService.getMyComInfo().then((result: Response) => {
        setComInfo(result?.response);
      });
    } else if (choosedTab === '4') {
      directoryService.getList('?type=3').then((result: Response) => {
        setDescriptions(result?.response?.data);
      });
    }
  }, [choosedTab, isReload]);

  const onChange = (key: string) => {
    setChoosedTab(key);
  };

  const onFinishDep = async (id, datas) => {
    if (id === undefined) {
      const res = await structureService.addStructure({ ...datas });
      message.success('Тасаг амжилттай нэмэгдлээ.');
    } else {
      const res = await structureService.editStructure(id, datas);
      message.success('Тасаг амжилттай засагдлаа.');
    }

    setChoosedItem(null);
    setOpenModal(false);
    setReload(prev => !prev);
  };

  const onDeleteDep = async (id: number) => {
    await structureService.deleteStructure(id);
    setReload(prev => !prev);
    message.success('Тасаг амжилттай устгагдлаа.');
  };

  const onFinishRoom = async datas => {
    const res = await roomService.addRoom({ ...datas });
    setOpenModal(prev => !prev);
    setReload(prev => !prev);
    message.success('Өрөө амжилттай нэмэгдлээ.');
  };

  const onFinishDirectory = async (id, datas) => {
    if (id === undefined) {
      const res = await directoryService.addDirectory({ ...datas });
      message.success('Тайлбар амжилттай нэмэгдлээ.');
    } else {
      const res = await directoryService.editDirectory(id, { ...datas });
      message.success('Тайлбар амжилттай засагдлаа.');
    }
    setOpenModal(false);
    setReload(prev => !prev);
    setChoosedItem(null);
  };

  const onDeleteRoom = async (id: number) => {
    await roomService.deleteRoom(id);
    setReload(prev => !prev);
    message.success('Өрөө амжилттай устгагдлаа.');
  };

  const onFinishType = async datas => {
    const res = await directoryService.addDirectory({ ...datas });
    setOpenModal(prev => !prev);
    setReload(prev => !prev);
    message.success('Мэс заслын төрөл амжилттай нэмэгдлээ.');
  };

  const onDeleteType = async (id: number) => {
    const res: Response = await directoryService.deleteDirectory(id);
    setReload(prev => !prev);

    if (res?.success) message.success('Мэс заслын төрөл амжилттай устгагдлаа.');
    else message.error('Тус төрлийг устгах боломжгүй байна.');
  };

  const handleClickButton = async () => {
    setOpenModal(true);
  };

  const handleDepEditClick = async item => {
    await setChoosedItem(item);
    await setOpenModal(true);
  };

  const handleDescEditClick = async item => {
    await setChoosedItem(item);
    await setOpenModal(true);
  };

  const handleChangeCompanyInfo = async (field, value) => {
    if (field === 'email') setComInfo(prev => ({ ...prev, email: value }));
    else if (field === 'name') setComInfo(prev => ({ ...prev, name: value }));
    else if (field === 'taskStartTime') setComInfo(prev => ({ ...prev, taskStartTime: value }));
  };

  const handleClickSaveButton = async () => {
    await companyService.updateCompany(company.id, {
      name: company.name,
      email: company.email,
      taskStartTime: company.taskStartTime,
    });
    setEditMode(false);
  };

  return (
    <MoreLayout>
      <RoomModal
        isModalVisible={openModal && choosedTab === '2'}
        onFinish={onFinishRoom}
        close={() => {
          setOpenModal(prev => !prev);
          setReload(prev => !prev);
        }}
      />
      {openModal && choosedTab === '4' ? (
        <DescModal
          isModalVisible={openModal && choosedTab === '4'}
          onFinish={onFinishDirectory}
          close={() => {
            setOpenModal(prev => !prev);
            setReload(prev => !prev);
          }}
          datas={choosedItem}
        />
      ) : (
        ''
      )}
      {openModal && choosedTab === '1' ? (
        <DepModal
          isModalVisible={openModal && choosedTab === '1'}
          onFinish={onFinishDep}
          close={() => {
            setOpenModal(prev => !prev);
            setReload(prev => !prev);
          }}
          datas={choosedItem}
        />
      ) : (
        ''
      )}
      <TypeModal
        isModalVisible={openModal && choosedTab === '3'}
        onFinish={onFinishType}
        close={() => {
          setOpenModal(prev => !prev);
          setReload(prev => !prev);
        }}
      />
      <div className={`border rounded px-7 bg-input py-4 mb-3 flex justify-between items-center`}>
        <div className="text-2xl font-bold">Тохиргоо</div>
        <div>
          <Button name="Нэмэх" onClick={handleClickButton} />
        </div>
      </div>
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="Тасаг" key="1">
          <div className=" grid grid-cols-7 gap-3 mb-5">
            {structures &&
              structures.length > 0 &&
              structures.map(item => {
                return (
                  <DepCard
                    {...item}
                    onEdit={() => handleDepEditClick(item)}
                    onDelete={() => onDeleteDep(item.id)}
                  />
                );
              })}
          </div>
        </TabPane>
        <TabPane tab="Өрөө" key="2">
          <div className=" grid grid-cols-7 gap-3 mb-5">
            {rooms &&
              rooms.length > 0 &&
              rooms.map(item => {
                return <RoomCard {...item} onDelete={() => onDeleteRoom(item.id)} />;
              })}
          </div>
        </TabPane>
        <TabPane tab="Байгууллага" key="3">
          <div className="flex flex-col">
            <div className="mb-2 w-28">
              <TextField
                label="Байгууллагын нэр"
                value={company?.name}
                disabled={!editMode}
                onChange={e => handleChangeCompanyInfo('name', e)}
              />
            </div>
            <div className="mb-2 w-20">
              <TextField
                label="Имэйл хаяг"
                value={company?.email}
                disabled={!editMode}
                onChange={e => handleChangeCompanyInfo('email', e)}
              />
            </div>
            <div className="mb-2 w-32">
              <TextField
                label="Бүртгэл эхлэх цаг"
                value={company?.taskStartTime}
                disabled={!editMode}
                onChange={e => handleChangeCompanyInfo('taskStartTime', e)}
              />
            </div>
            <div className="w-[100px] mt-2">
              {editMode ? (
                <Button name="Хадгалах" onClick={handleClickSaveButton} />
              ) : (
                <Button name="Засах" onClick={() => setEditMode(true)} />
              )}
            </div>
          </div>
        </TabPane>
        <TabPane tab="Цуцлах шалтгаан" key="4">
          <div className=" grid grid-cols-7 gap-3 mb-5">
            {descriptions &&
              descriptions.length > 0 &&
              descriptions.map(item => {
                return (
                  <DepCard
                    {...item}
                    onEdit={() => handleDescEditClick(item)}
                    onDelete={() => onDeleteRoom(item.id)}
                  />
                );
              })}
          </div>
        </TabPane>
        <TabPane tab="Шилжих тасаг" key="5">
          <div className=" grid grid-cols-7 gap-3 mb-5">
            {descriptions &&
              descriptions.length > 0 &&
              descriptions.map(item => {
                return (
                  <DepCard
                    {...item}
                    onEdit={() => handleDescEditClick(item)}
                    onDelete={() => onDeleteRoom(item.id)}
                  />
                );
              })}
          </div>
        </TabPane>
      </Tabs>
    </MoreLayout>
  );
};

export default withAuth(Settings);
