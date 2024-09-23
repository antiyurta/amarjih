import { Form, Modal, message } from 'antd';
import React, { useState, useEffect } from 'react';
import ContentWrapper from './style';
import { Checkbox, Col, Row } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

// services
import structureService from '@services/structure';
import fileService from '@services/file';
import userService from '@services/user';

// components
import Button from '@components/common/button';
import AvatarUploader from '@components/common/upload';
import TextField from '@components/common/TextField';
import CustomSelect from '@components/common/select';

interface Response {
  response?: any;
  success?: boolean;
  message?: string;
}

interface fileResponse {
  response?: {
    id: number;
  };
  success?: boolean;
}

const roles = [
  {
    id: 'admin',
    name: 'Системийн админ',
  },
  {
    id: 'doctor',
    name: 'Бүртгэл нэмнэ, засна',
  },
  {
    id: 'director',
    name: 'Мэс заслыг батлана, цуцлана',
  },
  {
    id: 'nurse',
    name: 'Бүртгэлд мэдээлэл оруулна, төлөв солино',
  },
];

const userStatuses = [
  {
    id: 1,
    name: 'Идэвхтэй',
  },
  {
    id: 2,
    name: 'Чөлөөлөгдсөн',
  },
];

export default function UserModal(props) {
  const isAddMode = props.data?.id > 0 ? false : true;
  const [deps, setDeps] = useState([]);
  const [apps, setApps] = useState([]);
  const [lastName, setLastName] = useState(!isAddMode ? props.data.lastName : '');
  const [firstName, setFirstName] = useState(!isAddMode ? props.data.firstName : '');
  const [email, setEmail] = useState(!isAddMode ? props.data.email : '');
  const [phone, setPhone] = useState(!isAddMode ? props.data.phone : '');
  const [role, setRole] = useState(!isAddMode ? props.data.role : 'nurse');
  const [choosedDep, setChoosedDep] = useState(!isAddMode ? props.data.depId : null);
  const [choosedApp, setChoosedApp] = useState(!isAddMode ? props.data.appId : null);
  const [avatarId, setAvatarFileId] = useState(!isAddMode ? props.data.avatarId : undefined);
  const [userStatus, setUserStatus] = useState(!isAddMode ? props.data.status : 1);
  const [userRoles, setUserRoles] = useState(!isAddMode ? props.data.userRoles : []);

  console.log(isAddMode);

  useEffect(() => {
    structureService.getList('?page=1&limit=30&type=1').then((result: Response) => {
      setDeps(result.response?.data);
    });
  }, []);

  useEffect(() => {
    if (choosedDep !== null)
      structureService
        .getList(`?page=1&limit=30&type=2&parentId=${choosedDep}`)
        .then((result: Response) => {
          setApps(result.response?.data);
        });
  }, [choosedDep]);

  const onFinish = async values => {
    if (lastName.length === 0 || firstName.length === 0) {
      message.error('Талбаруудыг бүрэн бөглөнө үү!');
      return;
    }

    console.log(userRoles);
    // return;

    if (isAddMode) {
      const result: Response = await userService.addUser({
        lastName,
        firstName,
        email,
        phone,
        depId: choosedDep,
        appId: choosedApp,
        companyId: 1,
        role,
        avatarId: avatarId,
        status: userStatus,
        userRoles,
      });

      if (!result?.success) {
        let errorMessage = 'Cервэр дээр алдаа гарлаа!';
        if (result.response.message === 'User with that email already exists') {
          errorMessage = 'Имэйл хаяг бүртгэлтэй байна';
        }
        message.error(errorMessage);
      } else {
        message.success('Ажилтан амжилттай нэмэгдлээ.');
        props.onFinish();
        setEmpty();
      }
    } else {
      const result: Response = await userService.editUser(props.data.id, {
        lastName,
        firstName,
        email,
        phone,
        depId: choosedDep,
        appId: choosedApp,
        companyId: 1,
        role,
        avatarId,
        status: userStatus,
      });
      if (!result?.success) {
        let errorMessage = 'Cервэр дээр алдаа гарлаа!';
        if (result.response.message === 'User with that email already exists') {
          errorMessage = 'Имэйл хаяг бүртгэлтэй байна';
        }
        message.error(errorMessage);
      } else {
        message.success('Ажилтаны мэдээлэл амжилттай засагдлаа.');
        props.onFinish();
        setEmpty();
      }
    }
  };

  const setEmpty = () => {
    setDeps([]);
    setApps([]);
    setLastName('');
    setFirstName('');
    setEmail('');
    setPhone('');
    setRole('');
    setChoosedDep(0);
    setChoosedApp(0);
    setAvatarFileId(0);
    setUserStatus(1);
  };

  const handleDepChange = async e => {
    setChoosedDep(e);
  };

  const handleAppChange = async e => {
    setChoosedApp(e);
  };

  const handleRolesChange = async e => {
    setRole(e);
  };

  const handleIsActiveChange = async e => {
    setUserStatus(e);
  };

  const handleUpload = async (e, callback) => {
    const res: fileResponse = await fileService.uploadFile(e);

    if (res.success) {
      setAvatarFileId(res?.response?.id);
      callback(res?.response?.id);
    }
  };

  const onChange = (checkedValues: CheckboxValueType[]) => {
    setUserRoles(checkedValues);
    console.log('checked = ', checkedValues);
  };

  return (
    <Modal
      open={props.isModalVisible}
      onCancel={() => {
        setEmpty();
        props.close();
      }}
      width={650}
      centered
      footer={
        <div className="flex justify-end items-center">
          <Button
            name="Цонхыг хаах"
            color="gray"
            onClick={() => {
              setEmpty();
              props.close();
            }}
          />
          <div className="ml-2">
            <Button name="Хадгалах" onClick={onFinish} />
          </div>
        </div>
      }
      title={
        <div className="font-bold text-xl">{isAddMode ? 'АЖИЛТАН НЭМЭХ' : 'АЖИЛТАН ЗАСАХ'}</div>
      }
    >
      <ContentWrapper>
        <div className="sm:pt-3 pb-2 sm:pb-5 space-y-8">
          <Form name="busBookingCheck" onFinish={onFinish}>
            <div className="flex justify-center">
              <div className="flex flex-row">
                <div className="p-4">
                  <div>
                    <AvatarUploader
                      onUpload={handleUpload}
                      avatarFileId={isAddMode ? 0 : avatarId}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <TextField
                      label="Эцэг/Эхийн нэр"
                      value={lastName}
                      require={true}
                      onChange={e => setLastName(e)}
                    />
                  </div>
                  <div className="mb-2">
                    <TextField
                      label="Нэр"
                      value={firstName}
                      onChange={e => setFirstName(e)}
                      require={true}
                    />
                  </div>
                  <div className="mb-2">
                    <TextField value={phone} label="Утасны дугаар" onChange={e => setPhone(e)} />
                  </div>
                  <div className="mb-2">
                    <TextField label="Имэйл хаяг" value={email} onChange={e => setEmail(e)} />
                  </div>
                  <div className="mb-2">
                    <CustomSelect
                      label="Тасаг"
                      items={deps}
                      value={choosedDep}
                      onChange={handleDepChange}
                      require={true}
                    />
                  </div>
                  <div className="mb-2">
                    <CustomSelect
                      label="Албан тушаал"
                      items={apps}
                      value={choosedApp}
                      onChange={handleAppChange}
                    />
                  </div>
                  <div className="mb-2">
                    <CustomSelect
                      label="Модулийн хандалтын тохиргоо"
                      onChange={handleRolesChange}
                      items={roles}
                      value={role}
                    />
                  </div>
                  <div className="mb-2">
                    <CustomSelect
                      label="Төлөв"
                      onChange={handleIsActiveChange}
                      items={userStatuses}
                      value={userStatus}
                    />
                  </div>
                  {/* <div className="mb-2">
                    <div className="block text-xs text-gray mt-4 mb-2">
                      Модулийн хандалтын тохиргоо
                    </div>
                    <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                      <Row>
                        {roles.map(item => {
                          const hasChecked = userRoles.findIndex(role => role.id === item.id);
                          return (
                            <Col span={24} style={{ marginBottom: 4 }}>
                              <Checkbox
                                value={item.id}
                                checked={hasChecked !== '-1' ? true : false}
                              >
                                {item.name}
                              </Checkbox>
                            </Col>
                          );
                        })}
                      </Row>
                    </Checkbox.Group>
                  </div> */}
                </div>
              </div>
            </div>
          </Form>
        </div>
      </ContentWrapper>
    </Modal>
  );
}
