import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { Input, Select } from 'antd';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import MoreLayout from '@components/layout/more';

import withAuth from '@hooks/hoc';

const { Search } = Input;

// components

// services
import customerService from '@services/customer';

// context
import { useAuthState } from '@context/auth';
import RegisterParser from '@utils/RegisterParser';

interface DataType {
  id: number;
  lastName: string;
  firstName: string;
  registerNumber: string;
}

interface Response {
  response?: any;
  success?: boolean;
  message?: string;
}

const Users = () => {
  const { isAuthenticated } = useAuthState();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [choosedRepeatId, setChoosedRepeatId] = useState(0);
  const [searchInputValue, setSearchInputValue] = useState(null);

  useEffect(() => {
    let searchValue = '';
    if (searchInputValue !== null && searchInputValue !== '') {
      searchValue = `&search=${searchInputValue}`;
    }
    customerService
      .getList(`?page=${page}&limit=20${searchValue}&taskCount=${choosedRepeatId}`)
      .then((res: Response) => {
        setUsers(res.response?.data);
        setTotal(res.response.meta.itemCount);
      });
  }, [page, searchInputValue, choosedRepeatId]);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Овог',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Нэр',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Регистр',
      dataIndex: 'registerNumber',
      key: 'registerNumber',
    },
    {
      title: 'Нас',
      dataIndex: 'registerNumber',
      key: 'registerNumber',
      render: number => (
        <div className="flex flex-row">
          <span className="text-sm">{RegisterParser(number).age}</span>
        </div>
      ),
    },
    {
      title: 'Хүйс',
      dataIndex: 'registerNumber',
      key: 'registerNumber',
      render: number => (
        <div className="flex flex-row">
          <span className="text-sm ml-1">{RegisterParser(number).gender}</span>
        </div>
      ),
    },
    {
      title: 'Онош',
      dataIndex: 'diagnose',
      key: 'diagnose',
      render: diagnose => (
        <div className="flex flex-row">
          <span className="text-sm">{diagnose?.name}</span>
        </div>
      ),
    },
    {
      title: 'Давтан эсэх',
      dataIndex: 'taskCount',
      key: 'taskCount',
      render: taskCount => (
        <div className="flex flex-row">
          <span className="text-sm">{taskCount === 2 ? 'Тийм' : 'Үгүй'}</span>
        </div>
      ),
    },
    {
      title: 'Бүртгэгдсэн огноо',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: createdAt => (
        <div className="flex flex-row">{moment(createdAt).format('YYYY/MM/DD')}</div>
      ),
    },
  ];

  const onSearch = value => {
    setSearchInputValue(value);
  };

  const onChangePage = e => {
    setPage(e);
  };

  if (!isAuthenticated) return <div>Ачааллаж байна.</div>;

  return (
    <MoreLayout>
      <div className={`border rounded px-3 bg-input py-4 mb-3 flex items-center`}>
        <div className="flex flex-row">
          <div className="text-2xl font-bold mr-8">Үйлчлүүлэгчийн бүртгэл {`(${total})`}</div>
          <Search placeholder="Хайлт хийх" allowClear onSearch={onSearch} style={{ width: 200 }} />
        </div>
        <div className="ml-4">
          <Select
            defaultValue={choosedRepeatId}
            style={{ width: 240, textAlign: 'left' }}
            onChange={e => {
              setChoosedRepeatId(e);
            }}
            allowClear
            options={[
              {
                label: 'Бүгд',
                value: 0,
              },
              {
                label: 'Анх',
                value: 1,
              },
              {
                label: 'Давтан',
                value: 2,
              },
            ]}
          />
        </div>
      </div>
      <div className="h-screen">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          pagination={{
            total: total,
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
