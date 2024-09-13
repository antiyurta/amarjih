import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MoreOutlined } from '@ant-design/icons';

import { Input, Space, Select } from 'antd';
import { Table, Dropdown, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import MoreLayout from '@components/layout/more';

import withAuth from '@hooks/hoc';

const { Search } = Input;
const { Option } = Select;

// components
import Button from '@components/common/button';
import UserModal from '@components/users/userModal';
import ConfirmModal from '@components/common/confirmModal';
import Alert from '@components/common/alert';

// services
import userService from '@services/user';
import structureService from '@services/structure';

// context
import { useAuthState } from '@context/auth';

interface DataType {
  id: number;
  lastName: string;
  firstName: string;
  appName: string;
  depName: string;
  phone: string;
  email: string;
  avatar: string;
}

interface Response {
  response?: any;
  success?: boolean;
  message?: string;
}

const Users = () => {
  const { isAuthenticated, setLogout, user } = useAuthState();
  const [isReload, setReload] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    itemCount: 20,
  });
  const [data, setData] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [page, setPage] = useState(1);

  const [deps, setDeps] = useState([]);
  const [choosedDepId, setChoosedDepId] = useState(0);
  const [choosedId, setChoosedId] = useState(0);
  const [searchInputValue, setSearchInputValue] = useState(null);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [status, setChoosedStatus] = useState(0);

  useEffect(() => {
    let choosedDepQuery = '',
      statusQuery = '';
    if (choosedDepId > 0) {
      choosedDepQuery = `&depId=${choosedDepId}`;
    }

    if (status > 0) {
      statusQuery = `&status=${status}`;
    }

    let searchValue = '';
    if (searchInputValue !== null && searchInputValue !== '') {
      searchValue = `&search=${searchInputValue}`;
    }
    userService
      .getList(`?page=${page}&limit=20${choosedDepQuery}${searchValue}${statusQuery}`)
      .then((res: Response) => {
        setUsers(res?.response?.data);
        setMeta(res?.response?.meta);
      });
  }, [page, isReload, choosedDepId, status, searchInputValue]);

  useEffect(() => {
    structureService.getList(`?type=1&companyId=1`).then((result: Response) => {
      const data: DataType[] = [];
      setDeps(result.response.data);
    });
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Зураг',
      dataIndex: 'avatarId',
      key: 'avatarId',
      width: 80,
      render: id =>
        id ? (
          <div className="h-10 w-10 rounded-full border border-gray flex justify-center items-center overflow-hidden">
            <Image
              src={`${process.env.BASE_API_URL}local-files/${id}`}
              alt="avatar"
              width={40}
              height={40}
              objectFit="contain"
            />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-3xl border border-gray flex justify-center items-center">
            <Image src={`/assets/images/user.png`} alt="avatar" width={22} height={22} />
          </div>
        ),
    },
    {
      title: 'Овог',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Нэр',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Албан тушаал',
      dataIndex: 'appStructure',
      key: 'appappStructure',
      render: text => <div>{text?.name}</div>,
    },
    {
      title: 'Тасаг',
      dataIndex: 'depStructure',
      key: 'depStructure',
      render: text => <div>{text?.name}</div>,
    },
    {
      title: 'Гар утас',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Имэйл хаяг',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Төлөв',
      dataIndex: 'status',
      key: 'status',
      render: (_, record: any) => {
        return <span>{record.status === 1 ? 'Идэвхтэй' : 'Чөлөөлөгдсөн'}</span>;
      },
    },
    {
      title: '',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record: any) => {
        return (
          <Space size="middle">
            <Dropdown
              menu={{
                items: [
                  {
                    key: '1',
                    label: 'Засах',
                    onClick: () => {
                      setData(record);
                      setOpenModal(true);
                    },
                  },
                  {
                    key: '2',
                    label: 'Устгах',
                    onClick: () => {
                      setChoosedId(record.id);
                      setOpenDeleteConfirmModal(true);
                    },
                  },
                ],
              }}
            >
              <a>
                <MoreOutlined style={{ fontSize: 18, color: 'gray' }} />
              </a>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const handleClickButton = async () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setData(null);
  };

  const onFinish = async datas => {
    setData(null);
    setReload(prev => !prev);
    handleClose();
  };

  const onSearch = value => {
    setSearchInputValue(value);
  };

  const onChangePage = e => {
    setPage(e);
  };

  const onDelete = async () => {
    const res: Response = await userService.deleteUser(choosedId);
    setOpenDeleteConfirmModal(prev => !prev);
    setChoosedId(0);

    if (!res.success) {
      message.error('Тус бичлэгийг устгах боломжгүй байна.');
      return;
    }

    setReload(prev => !prev);
    message.success('Үйлдлийг амжилттай гүйцэтгэлээ.');
  };

  if (!isAuthenticated) return <div>Ачааллаж байна.</div>;

  return (
    <MoreLayout>
      {openDeleteConfirmModal && (
        <ConfirmModal
          isModalVisible={openDeleteConfirmModal}
          title="Баталгаажуулах асуулт"
          description="Та тус бичлэгийг бүр мөсөн устгах гэж байна. 
        Үнэхээр устгах уу!"
          onAgree={onDelete}
          onCancel={() => {
            setChoosedId(0);
            setOpenDeleteConfirmModal(prev => !prev);
          }}
        />
      )}
      {openModal ? (
        <UserModal isModalVisible={openModal} onFinish={onFinish} close={handleClose} data={data} />
      ) : null}
      {serverError && (
        <div className="mb-3 mt-4 w-84 absolute top-0 left-0 right-0">
          <Alert
            type="error"
            message="Алдаа гарлаа"
            description={serverError}
            onClose={() => setServerError(null)}
          />
        </div>
      )}
      <div className={`border rounded px-3 bg-input py-4 mb-3 flex justify-between items-center`}>
        <div className="flex flex-row">
          <div className="text-2xl font-bold mr-8">Хүний нөөц {`(${meta?.itemCount})`}</div>
          <Search placeholder="Хайлт хийх" allowClear onSearch={onSearch} style={{ width: 200 }} />
          <div className="ml-4">
            {deps.length > 0 && (
              <Select
                defaultValue={choosedDepId}
                style={{ width: 240, textAlign: 'left' }}
                onChange={e => {
                  setChoosedDepId(e);
                }}
                allowClear
              >
                <Option value={0}>Бүх тасаг</Option>
                {deps.map(item => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </div>
          <div className="ml-4">
            {deps.length > 0 && (
              <Select
                defaultValue={0}
                style={{ width: 160, textAlign: 'left' }}
                onChange={e => {
                  setChoosedStatus(e);
                }}
                allowClear
              >
                <Option value={0}>Бүх төлөв</Option>
                <Option key={1} value={1}>
                  Идэвхтэй
                </Option>
                <Option key={2} value={2}>
                  Чөлөөлөгдсөн
                </Option>
              </Select>
            )}
          </div>
        </div>
        <div>
          <Button name="Нэмэх" onClick={handleClickButton} />
        </div>
      </div>
      <div className="h-screen">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          pagination={{
            total: meta?.itemCount,
            current: page,
            defaultPageSize: 20,
            onChange: onChangePage,
          }}
          locale={{ emptyText: 'Жагсаалтын цонх хоосон байна.' }}
        />
      </div>
    </MoreLayout>
  );
};

export default withAuth(Users);
