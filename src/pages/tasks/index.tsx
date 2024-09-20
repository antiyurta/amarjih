import React, { useState, useEffect } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Layout, DatePicker, message, Tag, Select, Space, Dropdown, Menu } from 'antd';
import { FiMenu, FiTrash2, FiEdit, FiUserPlus, FiXCircle } from 'react-icons/fi';
import moment from 'moment';
import type { DatePickerProps } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

const { Option } = Select;

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import MoreLayout from '@components/layout/more';
import ContentWrapper from './style';

// components
import Button from '@components/common/button';
import TaskModal from '@components/tasks/taskModal';
import NurseModal from '@components/tasks/nurseModal';
import CancelModal from '@components/tasks/cancelModal';
import ConfirmModal from '@components/common/confirmModal';
import ColumnChangeModal from '@components/tasks/columnChangeModal';
import PrintModal from '@components/tasks/printModal';
import TaskMoreDrawer from '@components/tasks/taskMoreDrawer';
import ContextMenu from '@components/tasks/contextMenu';

// utils
import RegisterParser from '@utils/RegisterParser';
import withAuth from '@hooks/hoc';
import timeFormatter from '@utils/TimeFormatter';

// services
import taskService from '@services/task';
import columnService from '@services/column';
import structureService from '@services/structure';
import directoryService from '@services/directory';

// context
import { useAuthState } from '@context/auth';

import styles from './tasks.module.css';
import { taskTypes } from '@utils/static-data';

const { Header, Sider, Content } = Layout;

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

const dateFormat = 'YYYY-MM-DD';

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={styles.rowdragging} {...props} />
));

const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const Surgery = () => {
  const { user } = useAuthState();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deps, setDeps] = useState([]);
  const [cols, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reload, setReload] = useState(false);
  const [descriptions, setDescriptions] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [choosedId, setChoosedId] = useState(0);
  const [choosedDepId, setChoosedDepId] = useState(0);
  const [choosedColumnId, setChoosedColumnId] = useState(0);
  const [currentActionIndex, setCurrentAction] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [openNurseModal, setOpenNurseModal] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [openAgreeConfirmModal, setOpenAgreeConfirmModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [openColumnModal, setOpenColumnModal] = useState(false);

  const [choosedData, setChoosedData] = useState(null);
  const [sideBarOpen, setSideBarShow] = useState(false);
  const [startDate, setStartDateFilter] = useState(moment().format('YYYY-MM-DD'));

  const columns: ColumnsType<DataType> = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: '№',
      dataIndex: 'position',
      key: 'position',
      width: 40,
      render: position => <span className="font-bold">{position}</span>,
    },
    {
      // title: 'Төрөл',
      title: 'Тасгийн төрөл',
      dataIndex: 'type',
      key: 'type',
      render: type => (
        <Tag color="rgb(182 207 243)">{taskTypes.find(item => item.value == type)?.label}</Tag>
      ),
      // render: type => (
      //   <div>
      //     {type === 1 ? (
      //       <Tag color="rgb(182 207 243)">Төлөвлөгөөт</Tag>
      //     ) : (
      //       <Tag color="#f50">Яаралтай</Tag>
      //     )}
      //   </div>
      // ),
    },
    {
      title: 'Нэр',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Овог',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    // {
    //   title: 'Нас / Хүйс',
    //   dataIndex: 'registerNumber',
    //   key: 'registerNumber',
    //   render: (_, record: any) => {
    //     return (
    //       <div className="flex flex-row items-center">
    //         <span className="text-sm">{record.currentAge}</span>
    //         <span className="ml-1"> /</span>
    //         <span className="text-sm ml-1">{RegisterParser(record.registerNumber).gender}</span>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: 'Бүртгэл',
    //   dataIndex: 'surgery',
    //   key: 'surgery',
    //   render: (_, record: any) => {
    //     return (
    //       <div className="flex flex-row items-center">
    //         <span className="text-sm line-clamp-2">{record?.taskWorkers[0]?.surgery.name}</span>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: 'Хугацаа',
    //   dataIndex: 'durationTime',
    //   key: 'durationTime',
    //   render: (_, record: any) => {
    //     return (
    //       <div className="flex flex-row items-center">
    //         <span className="text-sm">
    //           {timeFormatter(
    //             record?.durationWorkTime ? record?.durationWorkTime : record.durationIntTime
    //           )}
    //         </span>
    //       </div>
    //     );
    //   },
    // },
    {
      title: 'Өрөө',
      dataIndex: 'room',
      key: 'room',
      render: room => {
        return (
          <div className="flex items-center">
            <span>{room === null ? '-' : room.number}</span>
          </div>
        );
      },
    },
    {
      title: 'Төлөв',
      dataIndex: 'column',
      key: 'column',
      render: column => {
        return (
          <div className="">
            <Tag
              className="py-1 px-4 w-fit"
              color={column.color}
              style={{
                borderRadius: 4,
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 'bold',
              }}
            >
              <div className="w-auto">{column.name}</div>
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'right',
      render: (_, record: any) => (
        <Space size="middle">
          {/* {user?.response?.role === 'nurse' ? ( */}
          <a onClick={() => handleClickMenu(record.id, 'change_column')}>Төлөв солих</a>
          {/* ) : ( */}
          {/* '' */}
          {/* )} */}
          <a onClick={() => handleClickMenu(record.id, 'edit')}>Засах</a>
          <a onClick={() => handleClickMenu(record.id, 'delete')}>Устгах</a>
        </Space>
      ),
    },
  ];

  // const showMenu = record => [
  //   {
  //     key: 'edit',
  //     label: 'Засах',
  //     icon: <FiEdit />,
  //     onClick: () => handleClickMenu(record.id, 'edit'),
  //   },
  //   {
  //     key: 'delete',
  //     label: 'Устгах',
  //     icon: <FiTrash2 />,
  //     onClick: () => handleClickMenu(record.id, 'delete'),
  //   },
  //   {
  //     key: 'update',
  //     label: 'Мэдээлэл оруулах',
  //     icon: <FiUserPlus />,
  //     onClick: () => handleClickMenu(record.id, 'update'),
  //   },
  //   {
  //     key: 'more',
  //     label: 'Дэлгэрэнгүй',
  //     icon: <FiEdit />,
  //     onClick: () => {
  //       setSideBarShow(true);
  //       setChoosedData(record);
  //     },
  //   },
  //   {
  //     key: 'cancel',
  //     label: 'Цуцлах',
  //     icon: <FiXCircle />,
  //     onClick: () => handleClickMenu(record.id, 'cancel'),
  //   },
  //   {
  //     key: 'change_column',
  //     label: 'Төлөв солих',
  //     icon: <FiMenu />,
  //     onClick: () => handleClickMenu(record.id, 'change_column'),
  //   },
  // ];

  useEffect(() => {
    if (!user) return;
    const userRole = user?.response?.role;
    const userDepId = user?.response?.depId;
    let userDepQuery = `&authorDepId=${userDepId}`;
    if (userRole !== 'doctor') userDepQuery = '';

    let choosedDepQuery = '';
    if (choosedDepId > 0) {
      userDepQuery = '';
      choosedDepQuery = `&authorDepId=${choosedDepId}`;
    }

    let columnQuery = '';
    if (choosedColumnId > 0) {
      columnQuery = `&columnId=${choosedColumnId}`;
    }

    taskService
      .getList(
        `?page=${page}&limit=20&startDate=${startDate}${userDepQuery}${choosedDepQuery}${columnQuery}`
      )
      .then((result: Response) => {
        const data: DataType[] = [];
        for (let i = 0; i < result.response.data.length; i++) {
          data.push({
            key: result.response.data[i].id,
            ...result.response.data[i],
          });
        }
        setTotal(result.response.meta.itemCount);
        setTasks(data);
      });

    if (user?.response?.role !== 'doctor') {
      structureService.getList(`?type=1&companyId=1`).then((result: Response) => {
        const data: DataType[] = [];
        setDeps(result.response.data);
      });
    }

    columnService
      .getList({
        limit: 50,
      })
      .then((result: Response) => {
        const data: DataType[] = [];
        setColumns(result.response.data);
      });
    directoryService.getList('?type=3').then((result: Response) => {
      setDescriptions(result?.response?.data);
    });
  }, [user, reload, page, startDate, choosedDepId, choosedColumnId]);

  const handleClickArrow = async direction => {
    if (direction === 'left') {
      let prevDate = moment(startDate, dateFormat).subtract(1, 'days').format(dateFormat);
      setStartDateFilter(prevDate);
    } else {
      let nextDate = moment(startDate, dateFormat).add(1, 'days').format(dateFormat);
      setStartDateFilter(nextDate);
    }
  };

  const handleClickMenu = async (id, state) => {
    setChoosedId(id);
    // setContextMenu({
    //   data: null,
    //   visible: false,
    //   x: 0,
    //   y: 0,
    // });
    if (state === 'delete') {
      setOpenDeleteConfirmModal(prev => !prev);
    } else if (state === 'edit') {
      setOpenModal(prev => !prev);
    } else if (state === 'confirm') {
      setOpenAgreeConfirmModal(prev => !prev);
    } else if (state === 'update') {
      setOpenNurseModal(prev => !prev);
    } else if (state === 'change_column') {
      setOpenColumnModal(prev => !prev);
    } else if (state === 'cancel') {
      setCurrentAction(8);
      setOpenCancelModal(true);
    }
  };

  const onSave = async (id, values) => {
    if (id === 0) {
      const res: Response = await taskService.addTask(values);
      if (!res.success) {
        if (res.response.message === 'Tasks with that Start Time already exists') {
          message.error('Мэс заслын цаг давхардаж байна.');
          return;
        }
        message.error('Бичлэг нэмэхэд алдаа гарлаа.');
        return;
      }
    } else {
      const res: Response = await taskService.editTask(id, values);
      if (!res.success) {
        if (res.response.message === 'Tasks with that Start Time already exists') {
          message.error('Мэс заслын цаг давхардаж байна.');
          return;
        }
        message.error('Бичлэг нэмэхэд алдаа гарлаа.');
        return;
      }
    }

    setOpenModal(prev => !prev);
    onSuccessState();
  };

  const onUpdate = async values => {
    const res: Response = await taskService.planTask(choosedId, {
      ...values,
    });
    if (!res.success) {
      message.error('Бичлэг нэмэхэд алдаа гарлаа.');
      return;
    }

    setOpenNurseModal(false);
    onSuccessState();
  };

  const onDelete = async () => {
    const res: Response = await taskService.deleteTask(choosedId);
    setOpenDeleteConfirmModal(prev => !prev);

    if (!res.success) {
      message.error('Тус бичлэгийг устгах боломжгүй байна.');
      return;
    }
    onSuccessState();
  };

  const onConfirm = async () => {
    const res: Response = await taskService.allConfirmTask({
      columnId: 2,
      tasks: selectedRowKeys.map(item => item.toString()),
      description: 'Батлав',
    });
    if (!res.success) {
      message.error('Батлахад алдаа гарлаа.');
      return;
    }

    setOpenAgreeConfirmModal(prev => !prev);
    onSuccessState();
  };

  const onCancel = async values => {
    const res: Response = await taskService.cancelTask(choosedId, {
      columnId: 8,
      description: values.description,
    });
    if (!res.success) {
      message.error('Цуцлахад алдаа гарлаа.');
      return;
    }

    setChoosedId(0);
    setOpenCancelModal(false);
    onSuccessState();
  };

  const onChangeColumnId = async data => {
    const res: Response = await taskService.changeStatus(data.taskId, {
      roomId: data?.roomId,
      columnId: data.columnId,
      description: 'Төлөв солигдлоо',
    });
    if (!res.success) {
      message.error('Тус бичлэгийг төлвийг өөрчлөх боломжгүй байна.');
      return;
    }

    setOpenColumnModal(prev => !prev);
    onSuccessState();
  };

  const onSuccessState = async () => {
    setChoosedId(0);
    setCurrentAction(0);
    setReload(prev => !prev);
    setSelectedRowKeys([]);
    message.success('Үйлдлийг амжилттай гүйцэтгэлээ.');
  };

  const onChangeDayfilter: DatePickerProps['onChange'] = (date, dateString) => {
    if (dateString === '') dateString = moment().format(dateFormat);
    setStartDateFilter(dateString);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onChangePage = e => {
    setPage(e);
  };

  const onSortEnd = async ({ oldIndex, newIndex }: SortEnd) => {
    await taskService.changeTaskPosition({
      taskId: tasks[oldIndex].id * 1,
      newPos: tasks[newIndex].position * 1,
    });
    setReload(prev => !prev);
  };

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="rowdragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = tasks.findIndex(x => x.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  const handlePrint = () => {
    setOpenPrintModal(true);
  };

  return (
    <MoreLayout>
      {openModal ? (
        <TaskModal
          isModalVisible={openModal}
          close={() => {
            setOpenModal(prev => !prev);
            setChoosedId(0);
          }}
          onFinish={onSave}
          itemId={choosedId}
        />
      ) : (
        ''
      )}
      {openPrintModal ? (
        <PrintModal
          isModalVisible={openPrintModal}
          close={() => {
            setOpenPrintModal(prev => !prev);
          }}
          onFinish={onSave}
        />
      ) : (
        ''
      )}
      {openNurseModal && (
        <NurseModal
          isModalVisible={openNurseModal}
          close={() => {
            setChoosedId(0);
            setOpenNurseModal(false);
          }}
          itemId={choosedId}
          onFinish={onUpdate}
        />
      )}
      {openCancelModal ? (
        <CancelModal
          isModalVisible={openCancelModal}
          close={() => setOpenCancelModal(false)}
          datas={descriptions}
          onFinish={onCancel}
        />
      ) : null}
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
      {openAgreeConfirmModal && (
        <ConfirmModal
          isModalVisible={openAgreeConfirmModal}
          title="Баталгаажуулах асуулт"
          description="Та тус мэс заслыг батлах гэж байна. 
        Үнэхээр батлах уу!"
          onAgree={onConfirm}
          onCancel={() => {
            setChoosedId(0);
            setOpenAgreeConfirmModal(prev => !prev);
          }}
        />
      )}
      {openColumnModal && (
        <ColumnChangeModal
          isModalVisible={openColumnModal}
          title="Төлөв солих цонх"
          //   description="Та тус мэс заслыг батлах гэж байна.
          // Үнэхээр батлах уу!"
          itemId={choosedId}
          onFinish={onChangeColumnId}
          close={() => {
            setChoosedId(0);
            setOpenColumnModal(false);
          }}
        />
      )}
      {/* <ConfirmModal
        isModalVisible={openTypeConfirmModal}
        title="Баталгаажуулах асуулт"
        description="Та тус мэс заслын төлөвийг солих гэж байна. 
        Үнэхээр солих уу!"
        onAgree={onChangeType}
        onCancel={() => {
          setChoosedId(0);
          setOpenTypeConfirmModal(prev => !prev);
        }}
      /> */}
      <div className={`border rounded px-8 bg-input py-4 mb-3 flex justify-between items-center`}>
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold mr-5">Бүртгэл</div>
          <div className="flex justify-between items-center">
            <div
              onClick={() => {
                handleClickArrow('left');
              }}
              className="w-8 h-8 bg-white flex items-center justify-center border border-gray rounded cursor-pointer"
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path
                  d="M7 13L1 7L7 1"
                  stroke="#636363"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="w-auto h-8 rounded mr-0.5 ml-0.5">
              <DatePicker
                defaultValue={moment(startDate)}
                value={moment(startDate)}
                format={dateFormat}
                onChange={onChangeDayfilter}
              />
            </div>
            <div
              onClick={() => {
                handleClickArrow('right');
              }}
              className="w-8 h-8 bg-white flex items-center justify-center border border-gray rounded cursor-pointer"
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path
                  d="M1 13L7 7L1 1"
                  stroke="#636363"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            {deps && deps.length > 0 && (
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
            {cols && cols.length > 0 && (
              <Select
                defaultValue={choosedColumnId}
                style={{ width: 240, textAlign: 'left' }}
                onChange={e => {
                  setChoosedColumnId(e);
                }}
                allowClear
              >
                <Option value={0}>Бүх төлөв</Option>
                {cols.map(item => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.columnName}
                    </Option>
                  );
                })}
              </Select>
            )}
          </div>
        </div>
        <div className="flex flex-row">
          <div>
            <Button name="Нэмэх" color="green" onClick={() => setOpenModal(prev => !prev)} />
          </div>
          {user?.response?.role === 'doctor' && (
            <div>
              <Button name="Нэмэх" color="green" onClick={() => setOpenModal(prev => !prev)} />
            </div>
          )}
          {user?.response?.role === 'director' && (
            <div className="ml-2">
              <Button
                color={selectedRowKeys.length > 0 ? 'blue' : 'disabled'}
                name="Батлах"
                onClick={() => setOpenAgreeConfirmModal(prev => !prev)}
              />
            </div>
          )}
          {/* <div className="ml-2">
            <Button name="Хэвлэх" onClick={handlePrint} />
          </div> */}
        </div>
      </div>
      <div className="md:container md:mx-auto">
        <ContentWrapper>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            pagination={{
              total: total,
              current: page,
              defaultPageSize: 20,
              onChange: onChangePage,
            }}
            components={{
              body: {
                wrapper: DraggableContainer,
                row: DraggableBodyRow,
              },
            }}
            // onRow={(record, rowIndex) => {
            //   return {
            //     // onClick: event => {
            //     //   // setSideBarShow(true);
            //     //   setChoosedData(record);
            //     // },
            //     // onContextMenu: event => {
            //     //   event.preventDefault();
            //     //   if (!showContextMenu.visible) {
            //     //     document.addEventListener(`click`, function onClickOutside() {
            //     //       setContextMenu({
            //     //         visible: false,
            //     //         data: null,
            //     //         x: 0,
            //     //         y: 0,
            //     //       });
            //     //       document.removeEventListener(`click`, onClickOutside);
            //     //     });
            //     //   }
            //     //   setContextMenu({
            //     //     data: record.id,
            //     //     visible: true,
            //     //     x: event.clientX,
            //     //     y: event.clientY,
            //     //   });
            //     // },
            //   };
            // }}
            locale={{ emptyText: 'Жагсаалтын цонх хоосон байна.' }}
          />
          {/* {showContextMenu.visible && (
            <ContextMenu
              id={showContextMenu.data}
              visible={showContextMenu.visible}
              x={showContextMenu.x}
              y={showContextMenu.y}
              onClick={handleClickMenu}
              role={user?.response?.role}
            />
          )} */}
          {sideBarOpen && choosedData && (
            <TaskMoreDrawer
              datas={choosedData}
              visible={sideBarOpen}
              onClose={() => {
                setChoosedData(null);
                setSideBarShow(false);
              }}
            />
          )}
        </ContentWrapper>
      </div>
    </MoreLayout>
  );
};

export default withAuth(Surgery);
