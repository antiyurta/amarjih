import { Menu } from 'antd';
import React from 'react';
import { FiMenu, FiTrash2, FiEdit, FiUserPlus, FiXCircle } from 'react-icons/fi';

export default function ContextMenu(props) {
  const handleClickMenu = async action => {
    props.onClick(props.id, action);
  };

  const setMenus = role => {
    let menus = [];

    if (role === 'doctor') {
      menus = [
        {
          key: 'edit',
          label: 'Засах',
          icon: <FiEdit />,
        },
        {
          key: 'delete',
          label: 'Устгах',
          icon: <FiTrash2 />,
        },
        {
          key: 'update',
          label: 'Мэдээлэл оруулах',
          icon: <FiUserPlus />,
        },
      ];
    } else if (role === 'director') {
      menus = [
        {
          key: 'cancel',
          label: 'Цуцлах',
          icon: <FiXCircle />,
        },
      ];
    } else if (role === 'nurse') {
      menus = [
        {
          key: 'update',
          label: 'Мэдээлэл оруулах',
          icon: <FiUserPlus />,
        },

        {
          key: 'change_column',
          label: 'Төлөв солих',
          icon: <FiMenu />,
        },
        {
          key: 'cancel',
          label: 'Цуцлах',
          icon: <FiXCircle />,
        },
      ];
    }

    return menus;
  };

  return (
    <div
      id="dropdown"
      className="w-fit"
      style={{
        left: props.x,
        top: props.y,
        borderRadius: 4,
        position: 'absolute',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        paddingTop: 10,
      }}
    >
      <ul className="py-1 text-sm text-left" aria-labelledby="dropdownMenuIconButton">
        {setMenus(props.role).map(item => {
          return (
            <li key={item.key} onClick={() => handleClickMenu(item.key)}>
              <span className="flex flex-row items-center text-gray-300 block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                <div>{item.icon}</div>
                <div className="ml-3">{item.label}</div>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
