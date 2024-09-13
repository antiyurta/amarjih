import { isEmpty } from 'lodash';
import Client from '@lib/apiClient';
import UploadClient from '@lib/uploadClient';

const FileService = {
  async uploadFile(payload) {
    console.log('file payload', payload);
    const response = await UploadClient.post(
      '/local-files/fileUpload/',
      payload
    );
    return response.data;
  },
};

export default FileService;
