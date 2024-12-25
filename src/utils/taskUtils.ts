import { ResponseFile, User, Comment } from '@/api/data.types';

const sendFiles = async (
   objWithFiles: HTMLInputElement | DataTransfer,
   addFilesTOState: CallableFunction,
   fileList: ResponseFile[],
   sendler: CallableFunction,
   addFiles: CallableFunction,
   id: number,
   inForm: boolean,
   isEdit: boolean
) => {
   const form = new FormData();
   if (objWithFiles.files) {
      for (const file of objWithFiles.files) {
         form.append('file[]', file);
      }
      const paylord = await sendler(form);
      if (paylord.data && isEdit) {
         addFilesToServer(paylord.data.data, fileList, inForm, id, addFiles, addFilesTOState);
      }
      if (!isEdit) {
         addFilesTOState([...paylord.data.data, ...fileList]);
      }
   }
};

const addFilesToServer = async (
   files: ResponseFile[],
   fileList: ResponseFile[],
   inForm: boolean,
   id: number,
   addFiles: CallableFunction,
   addFilesTOState: CallableFunction
) => {
   for (const responseFile of files) {
      const queries = inForm
         ? { comment: id, file: responseFile?.id || -1 }
         : { task: id, file: responseFile?.id || -1 };
      const response = await addFiles(queries);
      addFilesTOState([responseFile, ...fileList]);
   }
};

const dateFormatter = (date: string | undefined) => {
   if (!date) return date;
   const formatted = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
   }).format(new Date(date));

   return formatted;
};

const commentFormatter = (
   value: string,
   activeUser: User | undefined,
   fileList: ResponseFile[],
   id?: number
): Comment => {
   const date = new Date(Date.now()).toDateString();
   return {
      id: id,
      content: value,
      files: fileList,
      user: activeUser,
      created_at: date,
      updated_at: date,
   };
};

export { sendFiles, dateFormatter, commentFormatter };
