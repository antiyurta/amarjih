import React, { FC, useState } from 'react';
import Image from 'next/image';

import { UserOutlined } from '@ant-design/icons';
import fileService from '@services/file';
import userService from '@services/user';

import AvatarUploader from '@components/common/upload';

interface Props {
  firstName?: string;
  appStructure?: any;
  avatarId?: string;
  lastName?: string;
}

interface fileResponse {
  response?: {
    id: number;
  };
  success?: boolean;
}

const Profile: FC<Props> = ({ firstName, appStructure, avatarId, lastName }) => {
  const [uploadMode, setUploadMode] = useState(false);
  const [fileId, setAvatarFileId] = useState(avatarId || 0);
  const handleUpload = async (e, callback) => {
    const res: fileResponse = await fileService.uploadFile(e);

    if (res.success) {
      await userService.editMyProfile({ avatarId: res?.response?.id });
      setAvatarFileId(res?.response?.id);
      callback(res?.response?.id);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 mb-5">
      <>
        {avatarId ? (
          <div className="h-24 w-24 rounded-full border border-gray flex justify-center items-center overflow-hidden">
            {/* <Image
              src={`${process.env.BASE_API_URL}local-files/${avatarId}`}
              alt="avatar"
              width={122}
              height={122}
              objectFit="cover"
            /> */}
            <div>
              <AvatarUploader
                onUpload={handleUpload}
                avatarFileId={uploadMode ? 0 : Number(fileId)}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white h-28 w-28 rounded-full border border-gray flex justify-center items-center overflow-hidden">
            <UserOutlined style={{ fontSize: '48px', color: 'gray' }} />
          </div>
        )}
      </>
      <div className="text-xl font-bold mt-2">
        {lastName[0]}.{firstName}
      </div>
      <div className="text-center text-primary">{appStructure?.name}</div>
    </div>
  );
};

Profile.defaultProps = {
  firstName: 'Админ',
  appStructure: {
    name: 'Системийн админ',
  },
};

export default Profile;
