import { useAddFilesToCommemtMutation, useAddFilesToTaskMutation, useSendFilesMutation } from '@/api/appApi';
import styles from './uploader.module.scss';
import { ResponseFile } from '@/api/data.types';
import { sendFiles } from '@/utils/taskUtils';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useModalInfo } from '@/hooks/useModalInfo';
import InfoModal from '../InfoModal/InfoModal';

export default function FileUploader({
   inForm,
   isEdit,
   addFilesTOState,
   fileList,
   commentId,
}: {
   inForm: boolean;
   isEdit: boolean;
   addFilesTOState: CallableFunction;
   fileList: ResponseFile[];
   commentId?: number;
}) {
   const upload = useRef(null);
   // обработать isLoading, isError
   const [sendler, { isError: sendError }] = useSendFilesMutation();

   const [addFilesToTask, { isError: errorAdded }] = useAddFilesToTaskMutation();
   const [addFileToComments, {}] = useAddFilesToCommemtMutation();
   const { modal, modalInfo, modalTitle, modalType, setCloseModal, setModalInfo, setModalTitle, setModalType } =
      useModalInfo();

   const router = useRouter();
   const taskID = Number(router.query['slug']);

   useEffect(() => {
      if (sendError) {
         setModalTitle('Ошибка');
         setModalInfo('Файлы не отправлены');
         setModalType('error');
         setCloseModal(true);
      }
      if (errorAdded) {
         setModalTitle('Ошибка');
         setModalInfo('Не удалось добавить файлы к задаче');
         setModalType('error');
         setCloseModal(true);
      }
   }, [sendError, errorAdded]);

   return (
      <>
         <label
            className={styles.upload}
            onDragOver={(e) => {
               e.stopPropagation();
               e.preventDefault();
            }}
            onDrop={(e) => {
               e.preventDefault();
               if (e.dataTransfer.files) {
                  const mutation = inForm ? addFileToComments : addFilesToTask;
                  const id = inForm && commentId ? commentId : taskID;
                  return sendFiles(e.dataTransfer, addFilesTOState, fileList, sendler, mutation, id, inForm, isEdit);
               }
            }}
         >
            <p className={styles.upload_text}>Выбери файлы или перетащи их сюда</p>
            <input
               ref={upload}
               onChange={() => {
                  if (upload.current) {
                     const mutation = inForm ? addFileToComments : addFilesToTask;
                     const id = inForm && commentId ? commentId : taskID;
                     if (id) {
                        return sendFiles(
                           upload.current,
                           addFilesTOState,
                           fileList,
                           sendler,
                           mutation,
                           id,
                           inForm,
                           isEdit
                        );
                     } else {
                     }
                  }
               }}
               className={styles.upload_input}
               name="avatar"
               type="file"
               multiple
            />
         </label>
         {modal ? <InfoModal type={modalType} title={modalTitle} info={modalInfo} setClose={setCloseModal} /> : <></>}
      </>
   );
}
