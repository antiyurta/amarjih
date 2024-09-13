import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { useRouter } from 'next/router';

import { Table, Menu, message } from 'antd';

import MoreLayout from '@components/layout/more';

import withAuth from '@hooks/hoc';

// components
import Button from '@components/common/button';
import AddModal from '@components/news/addModal';
import ConfirmModal from '@components/common/confirmModal';
import DeleteIcon from '@components/common/icons/delete';

// service
import newsService from '@services/news';

interface Response {
  response: any;
  success: boolean;
  message?: string;
}

const News = () => {
  const router = useRouter();
  const [isReload, setReload] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [news, setNews] = useState([]);
  const [choosedId, setChoosedId] = useState(0);

  useEffect(() => {
    newsService.getList().then((res: Response) => {
      console.log(res?.response?.data);
      setNews(res?.response?.data);
    });
  }, [isReload]);

  const handleClickButton = async () => {
    setOpenModal(true);
  };

  const handleClickDeleteMenu = async id => {
    setOpenConfirmModal(prev => !prev);
    setChoosedId(id);
  };

  const onDelete = async () => {
    await newsService.deleteNews(choosedId);
    setOpenConfirmModal(prev => !prev);
    setReload(prev => !prev);
    message.success('Мэдээ амжилттай устгагдлаа.');
  };

  const onFinish = async datas => {
    const res = await newsService.addNews({
      ...datas,
    });
    message.success('Мэдээ амжилттай нэмэгдлээ.');
    setOpenModal(prev => !prev);
    setReload(prev => !prev);
  };

  const renderMenu = id => {
    return (
      <Menu
        items={[
          // { key: '1', label: <div>Засах</div> },
          {
            key: '2',
            label: <div onClick={() => handleClickDeleteMenu(id)}>Устгах</div>,
          },
        ]}
      />
    );
  };

  const columns = [
    {
      title: 'Мэдээний агуулга',
      dataIndex: 'description',
      key: 'description',
      width: 'auto',
    },
    {
      title: 'Огноо',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: date => <span className="text-sm">{moment(date).format('YY/MM/DD')}</span>,
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: id => (
        <div onClick={() => handleClickDeleteMenu(id)}>
          <DeleteIcon />
        </div>
      ),
    },
  ];

  return (
    <MoreLayout>
      <AddModal
        isModalVisible={openModal}
        close={() => {
          setOpenModal(prev => !prev);
          setReload(prev => !prev);
        }}
        onFinish={onFinish}
      />
      <ConfirmModal
        isModalVisible={openConfirmModal}
        title="Баталгаажуулах асуулт"
        description="Та тус мэдээг бүр мөсөн устгах гэж байна. 
        Үнэхээр устгах уу!"
        onAgree={() => {
          onDelete();
        }}
        onCancel={() => {
          setChoosedId(0);
          setOpenConfirmModal(prev => !prev);
        }}
      />
      <div className={`border rounded px-3 bg-input py-4 mb-3 flex justify-between items-center`}>
        <div className="text-2xl font-bold">Зар мэдээ</div>
        <div>
          <Button name="Нэмэх" onClick={handleClickButton} />
        </div>
      </div>
      <div className="h-screen">
        {
          <Table
            columns={columns}
            dataSource={news}
            locale={{ emptyText: 'Жагсаалтын цонх хоосон байна.' }}
          />
        }
      </div>
    </MoreLayout>
  );
};

export default withAuth(News);
