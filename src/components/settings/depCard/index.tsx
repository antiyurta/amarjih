import React, { FC, useState } from 'react';
import Link from 'next/link';

import EditIcon from '@components/common/icons/edit';
import DeletIcon from '@components/common/icons/delete';
import ConfirmModal from '@components/common/confirmModal';

interface Props {
  id?: number;
  name?: string;
  shortName?: string;
  onEdit?: Function;
  onDelete?: Function;
}

const DepCard: FC<Props> = ({ id, name, shortName, onDelete, onEdit }) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  return (
    <>
      <ConfirmModal
        isModalVisible={openConfirmModal}
        title="Баталгаажуулах асуулт"
        description="Та тус тасгийг бүр мөсөн устгах гэж байна. 
        Үнэхээр устгах уу!"
        onAgree={() => {
          onDelete();
          setOpenConfirmModal(prev => !prev);
        }}
        onCancel={() => {
          setOpenConfirmModal(prev => !prev);
        }}
      />
      <div className="relative bg-input h-56 p-3 rounded-xl border flex justify-center flex-col">
        <Link href={`/settings/deps/${id}`}>
          <div className="mb-1 text-sm font-bold text-subtitle cursor-pointer hover:text-link">
            {name} ({shortName || '?'})
          </div>
        </Link>
        <div className="flex flex-row absolute bottom-2 right-2">
          <div className="mr-2" onClick={() => onEdit()}>
            <EditIcon />
          </div>
          <div onClick={() => setOpenConfirmModal(prev => !prev)}>
            <DeletIcon />
          </div>
        </div>
      </div>
    </>
  );
};

DepCard.defaultProps = {
  id: 1,
  name: 'Цээжний хөндийн мэс заслын тасаг',
};

export default DepCard;
