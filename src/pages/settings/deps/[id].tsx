import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { message, Tabs } from 'antd';
import { Breadcrumb } from 'antd';

import MoreLayout from '@components/layout/more';

// components
import Button from '@components/common/button';
import DepCard from '@components/settings/depCard';
import DepModal from '@components/settings/depModal';

// services
import structureService from '@services/structure';

import withAuth from '@hooks/hoc';

interface Response {
  response?: any;
  success?: boolean;
  message?: string;
}

const { TabPane } = Tabs;

const Department = () => {
  const router = useRouter();
  const [choosedTab, setChoosedTab] = useState('1');
  const [rooms, setRooms] = useState([]);
  const [types, setTypes] = useState([]);
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
    structureService.getList(`?parentId=${router.query.id}`).then((result: Response) => {
      setStructures(result?.response?.data);
    });
  }, [isReload, router.query.id]);

  const onFinishDep = async (id, datas) => {
    const parentId = +router.query.id;
    Object.assign(datas, {
      parentId: parentId,
      type: 2,
      shortName: 'Товч нэр',
    });
    const res = await structureService.addStructure({ ...datas });
    message.success('Амжилттай нэмэгдлээ.');
    setChoosedItem(null);
    setOpenModal(false);
    setReload(prev => !prev);
  };

  const onDeleteDep = async (id: number) => {
    await structureService.deleteStructure(id);
    setReload(prev => !prev);
    message.success('Амжилттай устгагдлаа.');
  };

  const handleClickButton = async () => {
    setOpenModal(true);
  };

  const handleDepEditClick = async item => {
    await setChoosedItem(item);
    await setOpenModal(true);
  };

  return (
    <MoreLayout>
      {openModal ? (
        <DepModal
          isModalVisible={openModal}
          onFinish={onFinishDep}
          close={() => {
            setOpenModal(prev => !prev);
            setReload(prev => !prev);
          }}
          title={`Албан тушаал нэмэх`}
          datas={choosedItem}
        />
      ) : (
        ''
      )}
      <div className={`border rounded px-8 bg-input py-4 mb-3 flex justify-between items-center`}>
        <div className="text-2xl font-bold">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="/settings">Тохиргоо</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="">Мэс заслын тасаг</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Албан тушаалууд</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div>
          <Button name="Нэмэх" onClick={handleClickButton} />
        </div>
      </div>
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
    </MoreLayout>
  );
};

export default withAuth(Department);
