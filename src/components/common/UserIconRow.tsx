import { Select } from 'antd';
import React, { FC } from 'react';
import Image from 'next/image';

interface Props {
  data?: any;
}

const UserIconRow: FC<Props> = ({ data }) => {
  return (
    <div className="flex flex-row items-center">
      <div>
        <div className="text-gray-500">
          {data.lastName[0]}.{data.firstName}
        </div>
      </div>
    </div>
  );
};

UserIconRow.defaultProps = {
  data: {
    lastName: 'Баасансүрэн',
    firstName: 'Баасансүрэн',
    avatarId: 48,
  },
};

export default UserIconRow;
