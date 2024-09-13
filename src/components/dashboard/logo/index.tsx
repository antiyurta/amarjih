import React, { FC, useRef, memo } from 'react';
import Image from 'next/image';

interface Props {
  logoPath?: string;
}

const Logo: FC<Props> = ({ logoPath }) => {
  const cnt = useRef(0);
  console.log('Render Logo', cnt.current++);
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="mr-1">
        <Image src={logoPath} alt="avatar" width={53} height={44} />
      </div>
      <div className="text-secondary font-bold ">
        Налайх ЭМТ-ийн <br /> мэс заслын мэдээлэл{' '}
      </div>
    </div>
  );
};

Logo.defaultProps = {
  logoPath: '/assets/images/icon.png',
};

export default memo(Logo, (prev, next) => prev.logoPath === next.logoPath);
