import React, { FC, useState } from 'react';

import EditIcon from '@components/common/icons/edit';
import DeletIcon from '@components/common/icons/delete';
import ConfirmModal from '@components/common/confirmModal';

interface Props {
  id?: number;
  number?: number;
  status?: string;
  taskCount?: number;
  onDelete?: Function;
}

const RoomCard: FC<Props> = ({ id, number, status, onDelete, taskCount }) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  return (
    <>
      <ConfirmModal
        isModalVisible={openConfirmModal}
        title="Баталгаажуулах асуулт"
        description="Та тус өрөөг бүр мөсөн устгах гэж байна. 
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
        <div className="mb-1 text-2xl font-bold text-subtitle">{number}</div>
        <div className="mb-1 text-gray">{status}</div>
        <div className="flex flex-row absolute bottom-2 right-2">
          {/* <div className="mr-2">
            <EditIcon />
          </div> */}
          <div onClick={() => setOpenConfirmModal(prev => !prev)}>
            <DeletIcon />
          </div>
        </div>
      </div>
    </>
  );
};

RoomCard.defaultProps = {
  id: 1,
  number: 43,
  status: '',
  taskCount: 34,
};

export default RoomCard;
