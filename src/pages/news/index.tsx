import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { useRouter } from 'next/router';

import { Table, Menu, message, Space } from 'antd';

import MoreLayout from '@components/layout/more';

import withAuth from '@hooks/hoc';

// components
import Button from '@components/common/button';
import AddModal from '@components/news/addModal';
import ConfirmModal from '@components/common/confirmModal';
import DeleteIcon from '@components/common/icons/delete';

// service
import newsService from '@services/news';
import Image from 'next/image';
import EditIcon from '@components/common/icons/edit';

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
    setChoosedId(0);
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
    if (choosedId == 0) {
      const res: Response = await newsService.addNews({
        ...datas,
      });
      if (res.success) {
        message.success('Мэдээ амжилттай нэмэгдлээ.');
      } else {
        message.error('Мэдээ нэмхэд алдаа гарлаа.');
        return;
      }
    } else {
      const res: Response = await newsService.editNews(choosedId, datas);
      if (res.success) {
        message.success('Мэдээ амжилттай заслаа.');
      } else {
        message.error('Мэдээ засхад алдаа гарлаа.');
        return;
      }
    }
    setOpenModal(prev => !prev);
    setReload(prev => !prev);
  };
  const handleClickMenu = async (id, state) => {
    setChoosedId(id);
    if (state === 'delete') {
      handleClickDeleteMenu(prev => !prev);
    } else if (state === 'edit') {
      setOpenModal(prev => !prev);
    }
  };

  const columns = [
    {
      title: 'Зураг',
      dataIndex: 'path',
      key: 'path',
      width: 'auto',
      render: path => (path ? <Image src={path} alt={''} width={100} height={100} /> : '?'),
    },
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
        <Space size="middle">
          <div onClick={() => handleClickMenu(id, 'edit')}>
            <EditIcon />
          </div>
          <div onClick={() => handleClickMenu(id, 'delete')}>
            <DeleteIcon />
          </div>
        </Space>
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
        itemId={choosedId}
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
