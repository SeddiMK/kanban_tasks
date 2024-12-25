import React, { useState, useEffect } from 'react';
import style from '@/components/file_upload/file-upload.module.scss';
import Clipper from '@public/icons/clipper.svg';
import { BASE_URL } from '@/consts';
import { ResponseFile, TaskSingle } from '@/api/data.types';
import { useFileUploader } from '@/modules/TaskModalCreationEditing/utils/useFileUploader';
import { useDelFilesFromTaskMutation } from '@/api/appApi';

type ResponseFileWithObject = {
   id?: number;
   original_name?: string;
   link?: string;
   created_at?: string;
   updated_at?: string;
   fileObject: File;
};

interface FileUploadProps {
   taskId: number | undefined;
   files: ResponseFile[] | [];
   onFilesChange: (newFiles: ResponseFile[] | undefined) => void;
   error?: string;
   isSuccess?: boolean;
   disabled?: boolean;
   refetch?: CallableFunction | undefined;
}

// Утилиты для проверки типов
function isResponseFileWithObject(file: any): file is ResponseFileWithObject {
   return file && typeof file === 'object' && 'fileObject' in file;
}

export default function FileUpload({ taskId, files, onFilesChange, error, isSuccess, refetch }: FileUploadProps) {
   const [isDragging, setIsDragging] = useState(false);
   const [permissions, setPermissions] = useState(false);
   const [fileLocal, setFileLocal] = useState<ResponseFileWithObject[] | []>([]);
   const [deleteFileTaskMutation] = useDelFilesFromTaskMutation();
   const { sendFiles } = useFileUploader();

   const isImageFile = (fileName: string): boolean => {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
      const ext = fileName.split('.').pop()?.toLowerCase();
      return imageExtensions.includes(ext || '');
   };

   const isDuplicateFile = (newFile: ResponseFileWithObject): boolean => {
      return fileLocal.some((file) => file?.original_name === newFile?.original_name || file?.link === newFile?.link);
   };

   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(true);
   };

   const handleDragLeave = () => {
      setIsDragging(false);
   };

   const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);

      const droppedFiles = event.dataTransfer.files;
      const updatedFiles: ResponseFileWithObject[] = [...fileLocal];

      for (const file of Array.from(droppedFiles)) {
         if (!file) continue;

         const newFile: ResponseFileWithObject = {
            original_name: file.name,
            link: URL.createObjectURL(file),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            fileObject: file,
         };

         if (!isDuplicateFile(newFile)) {
            updatedFiles.push(newFile);
         }
      }

      if (updatedFiles.length > 0) {
         setPermissions(false);
         setFileLocal(updatedFiles);
         handleFileUpload(updatedFiles);
      } else {
         setPermissions(true);
      }
   };

   const handleFileUpload = async (files: ResponseFileWithObject[]) => {
      if (!files.length) return;

      const filterFileId = files.filter((file) => file.id === undefined);
      const filesId = files.filter((file) => file.id !== undefined);

      try {
         let newFiles: ResponseFile[] | undefined = [];
         const uploadedFiles = await sendFiles(filterFileId);

         if (filesId?.length > 0) {
            newFiles = [...(filesId || []), ...(uploadedFiles || [])];
         } else {
            newFiles = uploadedFiles;
         }

         if (onFilesChange && newFiles) {
            onFilesChange(newFiles);

            if (refetch) refetch();
         }
      } catch (error) {}
   };

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = event.target.files;
      if (!newFiles) return;

      const updatedFiles: ResponseFileWithObject[] = [...fileLocal];

      for (const file of Array.from(newFiles)) {
         const newFile: ResponseFileWithObject = {
            original_name: file.name,
            link: URL.createObjectURL(file),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            fileObject: file,
         };

         if (!isDuplicateFile(newFile)) {
            updatedFiles.push(newFile);
         }
      }

      if (updatedFiles) {
         setPermissions(false);
         setFileLocal(updatedFiles);
         handleFileUpload(updatedFiles);
      } else {
         setPermissions(true);
      }

      event.target.value = '';
   };

   const handleDeleteFile = async (taskId: number, file: ResponseFile[]) => {
      try {
         if (file[0]?.id) {
            const response = await deleteFileTaskMutation({
               task: taskId,
               file: file[0]?.id,
            }).unwrap();

            if (response?.data) {
               const filesResponse: TaskSingle = response.data;

               if (onFilesChange) {
                  onFilesChange(filesResponse.files);
               }
            }
         }
      } catch (error) {}
   };

   const handleRemoveFile = (file: ResponseFileWithObject) => {
      const updatedFiles = fileLocal.filter((f) => f?.original_name !== file?.original_name);
      setFileLocal(updatedFiles);

      const deletedFile = files.filter((f) => f?.original_name === file?.original_name);
      if (taskId) {
         handleDeleteFile(taskId, deletedFile);
      }
   };

   useEffect(() => {
      if (files) {
         if (files.length > 0 && fileLocal.length === 0) {
            const updatedFiles: ResponseFileWithObject[] = files
               .filter((file): file is ResponseFile => file !== null && file?.id !== undefined)
               .map((file) => {
                  const correctedLink = file !== null && file.link ? BASE_URL + file.link.substring(1) : '';
                  const fileObject = new File([], (file !== null && file.original_name) || '');

                  return {
                     ...file,
                     link: correctedLink,
                     fileObject,
                  };
               });
            setFileLocal(updatedFiles);
         }
      }
   }, [files, isSuccess]);

   return (
      <div className={style['files-upload']}>
         <div className={style['files-prev']}>
            {fileLocal.length > 0 && (
               <ul className={style['list']}>
                  {fileLocal.map((file, index) => (
                     <li className={style['item']} key={index}>
                        {isResponseFileWithObject(file) && isImageFile(file?.original_name || '') ? (
                           <div>
                              <img
                                 src={file.link}
                                 alt={file.original_name || 'Без имени'}
                                 className={style['preview-image']}
                              />
                              <p>{file.original_name || 'Без имени'}</p>
                           </div>
                        ) : (
                           <a href={file.link || ''} target="_blank" rel="noopener noreferrer">
                              {file.original_name || 'Без имени'}
                           </a>
                        )}
                        <button type="button" onClick={() => handleRemoveFile(file)}>
                           ✕
                        </button>
                     </li>
                  ))}
               </ul>
            )}
         </div>

         <div
            className={`${style['inp-wrp']} ${isDragging ? style['drag-active'] : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
         >
            <label className={style['label']} htmlFor="file-upload">
               <div className={style['icon-wrp']}>
                  <Clipper />
               </div>
               <span>Выбери файлы или перетащи их сюда</span>
            </label>
            <input className={style['input']} id="file-upload" type="file" onChange={handleFileChange} />
         </div>

         {permissions && <div className={style['error']}>У вас нет разрешения на загрузку файла.</div>}
         {error && <div className={style['error']}>{error}</div>}
      </div>
   );
}
