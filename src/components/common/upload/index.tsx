import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useState } from 'react';
import Image from 'next/image';
import cameraIcon from 'public/assets/images/camera.png';

interface Props {
  onUpload: Function;
  onPreview?: Function;
  avatarFileId?: number;
}

interface formType {
  file?: any;
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const CustomUploader: React.FC<Props> = ({ onUpload, avatarFileId }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    avatarFileId === 0 ? '' : `${process.env.BASE_API_URL}local-files/${avatarFileId}`
  );

  const handleChange: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      const formData = new FormData();
      formData.append('file', info?.file?.originFileObj);
      onUpload(formData, res => {
        console.log(res);
        setImageUrl(`${process.env.BASE_API_URL}local-files/${res}`);
        setLoading(false);
      });
    }
  };

  const uploadButton = (
    <div className="w-56">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Зураг</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader w-42"
      showUploadList={false}
      // onPreview={handlePreview}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <div className="border border-red" style={{ backgroundImage: imageUrl }}>
          <Image src={imageUrl} alt="avatar" width={134} height={134} objectFit="cover" />
          <div className="absolute top-44 left-40">
            <Image src={cameraIcon} alt="avatar" width={20} height={20} objectFit="cover" />
          </div>
          {/* <img crossOrigin="anonymous" src={imageUrl} alt="avatar" width={122} height={122} /> */}
        </div>
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default CustomUploader;
