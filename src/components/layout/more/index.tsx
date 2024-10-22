import { BarChartOutlined, CloudOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';

import Image from 'next/image';
import { Layout, Divider } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

// context
import { useAuthState } from '@context/auth';

// components
import MenuButton from '@components/common/menuButton';
import Profile from '@components/layout/Profile';

const { Content, Sider } = Layout;

const setMenu = [
  {
    link: 'tasks',
    icon: CloudOutlined,
    title: 'Бүртгэл',
  },
  {
    link: 'dashboard',
    icon: BarChartOutlined,
    title: 'Хянах самбар',
  },
  {
    link: 'users',
    icon: UserOutlined,
    title: 'Хүний нөөц',
  },
  // {
  //   link: 'customers',
  //   icon: UserOutlined,
  //   title: 'Үйлчлүүлэгчдийн бүртгэл',
  // },
  {
    link: 'settings',
    icon: ShopOutlined,
    title: 'Тохиргоо',
  },
  {
    link: 'news',
    icon: ShopOutlined,
    title: 'Мэдээлэл',
  },
];
const adminMenus = ['tasks', 'dashboard', 'users', 'settings', 'news'];
const nurseMenus = ['tasks'];
const operatorMenus = ['news'];
interface Props {
  children?: any;
}

const MoreLayout: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, setLogout, user } = useAuthState();

  const router = useRouter();

  const [choosedMenu, setChoosedMenu] = useState(router.pathname);

  const handleMenuClick = async (link: string) => {
    if (link !== choosedMenu) {
      setChoosedMenu(link);
      router.push(`/${link}`);
    }
  };

  const handleLogouButtonClick = async () => {
    await setLogout();
    router.push('/');
    return;
  };

  let menus = setMenu?.map(item => ({
    link: item.link,
    icon: React.createElement(item.icon),
    label: item.title,
  }));

  return (
    <Layout hasSider>
      <Sider
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          padding: 10,
          background: '#f6f6f6',
        }}
      >
        <div className="w-full flex justify-between items-center flex-col h-full">
          <div>
            <div className="flex flex-row justify-center items-center">
              <div className="flex justify-center mr-2">
                <Image
                  src={`/assets/icon.png`}
                  alt="avatar"
                  width={46}
                  height={35}
                  objectFit="cover"
                />
              </div>

              <div className="text-xs font-bold mt-2 text-secondary text-left">
                НИЙСЛЭЛИЙН АМГАЛАН АМАРЖИХ ГАЗАР
              </div>
            </div>
            <Divider dashed />
            <div>
              <Profile {...user.response} />
              {menus
                .filter(item => {
                  if (user?.response?.role == 'admin') {
                    return adminMenus.includes(item.link);
                  } else if (user?.response?.role == 'nurse') {
                    return nurseMenus.includes(item.link);
                  } else {
                    return operatorMenus.includes(item.link);
                  }
                })
                .map((item, ind) => {
                  return (
                    <MenuButton
                      key={ind}
                      {...item}
                      choosed={`/${item.link}` === choosedMenu}
                      onClick={() => handleMenuClick(item.link)}
                    />
                  );
                })}
            </div>
          </div>
          <div className="mb-2">
            <button
              onClick={handleLogouButtonClick}
              className="w-auto text-lg bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-6 border border-cotton-700 rounded"
            >
              Гарах
            </button>
          </div>
        </div>
      </Sider>
      <Layout className="site-layout bg-white" style={{ marginLeft: 250, padding: 16 }}>
        <Content className="bg-white" style={{ overflow: 'initial' }}>
          <div style={{ textAlign: 'center' }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MoreLayout;
