import { Select } from 'antd';
import React, { FC } from 'react';
import Image from 'next/image';

interface Props {
  data?: any;
}

const TopUserRow: FC<Props> = ({ data }) => {
  const roles = ['Оператор', '1-р туслах', '2 -р туслах', 'Мэдээгүйжүүлэг', 'Сувилагч'];
  return (
    <div className="flex flex-col items-center justify-center w-32">
      <div className="flex justify-center items-center rounded-full overflow-hidden border">
        <Image
          src={`${process.env.BASE_API_URL}local-files/${data.avatarId}`}
          alt="avatar"
          width={63}
          height={63}
          objectFit="cover"
        />
      </div>
      <div>
        <div className="mt-3 font-bold">
          {data.lastName[0]}.{data.firstName}
        </div>
        <div className="text-[#6A6A6A] text-sm leading-4 h-[70px]">{data.depName}</div>
        <div className="font-bold text-2xl mt-6">{data.taskcount}</div>
        <div className="text-[#6A6A6A] font-bold">{roles[data.duty - 1]}</div>
      </div>
    </div>
  );
};

TopUserRow.defaultProps = {
  data: {
    lastName: 'Test',
    firstName: 'Test',
    userId: 55,
    taskcount: 123,
    depName: 'Элэг цөс нойр булчирхайн тасаг',
  },
};

export default TopUserRow;
