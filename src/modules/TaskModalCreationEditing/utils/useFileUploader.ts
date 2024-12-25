import { ResponseFile } from '@/api/data.types';
import { useSendFilesMutation } from '@/api/appApi';

export type ResponseFileWithObject = ResponseFile & {
   fileObject: File;
};

export const useFileUploader = () => {
   const [sendler] = useSendFilesMutation();

   const sendFiles = async (files: ResponseFileWithObject[]) => {
      if (!files.length) {
         return [];
      }

      const form = new FormData();

      Array.from(files).forEach((file) => {
         form.append('file[]', file.fileObject);
      });

      try {
         const response = await sendler(form);

         return response?.data?.data;
      } catch (error) {
         return [];
      }
   };

   return { sendFiles };
};
