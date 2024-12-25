import { ResponseFile } from '@/api/data.types';
import styles from './file.module.scss';
import Close from '@public/icons/close.svg';
import Cart from '@public/icons/task-delete.svg';
import { BASE_URL } from '@/consts';
import { useDelFilesFromTaskMutation } from '@/api/appApi';
import { useRouter } from 'next/router';
import { dateFormatter } from '@/utils/taskUtils';

export default function FilePriview({
   file,
   inComment,
   deleteFile,
   files,
   editMode,
}: {
   file: ResponseFile;
   inComment: boolean;
   deleteFile: CallableFunction;
   files: ResponseFile[];
   editMode: boolean;
}) {
   const [delFile, {}] = useDelFilesFromTaskMutation();
   const router = useRouter();
   const taskId = Number(router.query['slug']);

   const deleteFileFromTask = async (files: ResponseFile[], file: ResponseFile, delFile: CallableFunction) => {
      if (taskId) {
         const result = await delFile({ task: taskId, file: file?.id });
         deleteFile(files.filter((item) => item?.id !== file?.id));
         console.log(result.data);
      }
   };
   if (inComment) {
      return (
         <div className={styles.file_smallbox}>
            <p className={styles.file_name} style={{ paddingTop: 0, color: '#2d2d2d', maxWidth: 85 }}>
               {file?.original_name}
            </p>
            {editMode ? (
               <Close
                  className={styles.file_closeicon}
                  onClick={() => deleteFile(files.filter((item) => item?.id !== file?.id))}
               />
            ) : (
               <></>
            )}
         </div>
      );
   } else {
      return (
         <div className={styles.file_box}>
            <figure className={styles.file_imgbox}>
               <img
                  className={styles.file_img}
                  src={`${BASE_URL}${file?.link}`}
                  width={184}
                  alt={file?.original_name}
               />
            </figure>
            <p className={styles.file_name}>{file?.original_name}</p>
            <p className={styles.file_date}>{dateFormatter(file?.updated_at) || dateFormatter(file?.created_at)}</p>
            <Cart className={styles.file_carticon} onClick={() => deleteFileFromTask(files, file, delFile)} />
         </div>
      );
   }
}
