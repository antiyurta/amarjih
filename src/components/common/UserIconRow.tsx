import { Select } from 'antd';
import React, { FC } from 'react';
import Image from 'next/image';

interface Props {
  data?: any;
}

const UserIconRow: FC<Props> = ({ data }) => {
  console.log(data);
  return (
    <div className="flex flex-row items-center">
      <div className="flex justify-center items-center rounded-full overflow-hidden border mr-3">
        <Image
          src={`${process.env.BASE_API_URL}local-files/${data.avatarId}`}
          alt="avatar"
          width={22}
          height={22}
          objectFit="cover"
        />
      </div>
      <div>
        <div className="text-gray-500">
          {data.lastName[0]}.{data.firstName}
        </div>
        {/* <div className="text-black">{data.firstName}</div> */}
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
