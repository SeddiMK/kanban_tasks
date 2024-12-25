import { Comment, User } from '@/api/data.types';
import styles from './comment.module.scss';
import Edit from '@public/icons/task-edit.svg';
import Delete from '@public/icons/task-delete.svg';
import Copy from '@public/icons/copy-comment.svg';
import Close from '@public/icons/close.svg';
import { useEffect, useState } from 'react';
import FilePriview from '../FilePreveiw/FilePreview';
import CommentForm from '../CommentForm/CommentForm';
import parse from 'html-react-parser';
import { useDeleteCommentMutation } from '@/api/appApi';
import { dateFormatter } from '@/utils/taskUtils';
import { useModalInfo } from '@/hooks/useModalInfo';
import InfoModal from '../InfoModal/InfoModal';

export default function CommentComp({
   comment,
   allComments,
   setComments,
   activeUser,
}: {
   comment: Comment | undefined;
   allComments: Comment[];
   setComments: CallableFunction;
   activeUser: User | undefined;
}) {
   const [editMode, setEditMode] = useState(false);
   const [commentFiles, setCommentFiles] = useState(comment?.files || []);

   const [deleteComment, { isError: deleteError, isSuccess: deleteSuccess }] = useDeleteCommentMutation();
   const { modal, modalInfo, modalTitle, modalType, setModalInfo, setModalTitle, setModalType, setCloseModal } =
      useModalInfo();

   const deleteCommentHandler = async () => {
      if (comment?.id) {
         const deletedComment = await deleteComment(comment?.id);
      }
      setComments(allComments.filter((comm) => comm.id !== comment?.id));
   };

   const copyCommentLink = async () => {
      await navigator.clipboard.writeText(window.location.href);
      setModalType('info');
      setModalTitle('Успешно');
      setModalInfo('Ссылка скопирована');
      setCloseModal(true);
   };

   const escapeEditComment = () => {
      setEditMode(!editMode);
      setCommentFiles(comment?.files || []);
   };

   useEffect(() => {
      if (deleteError) {
         setModalType('error');
         setModalTitle('Ошибка');
         setModalInfo('Не удалось удалить комментарий');
         setCloseModal(true);
      }
   }, [comment?.files, comment?.content, deleteError]);

   return (
      <>
         <div className={styles.comment}>
            <div className={styles.flex}>
               <div className={`${styles.flex} ${styles.userinfo}`}>
                  <figure className={styles.avatarbox}>
                     <img src={comment?.user?.avatar?.link} alt={comment?.user?.avatar?.original_name} />
                  </figure>
                  <div>
                     <p className={styles.username}>{comment?.user?.name}</p>
                     <p className={styles.userdate}>
                        {dateFormatter(comment?.updated_at) || dateFormatter(comment?.updated_at)}
                     </p>
                  </div>
               </div>
               {editMode ? (
                  <Close onClick={() => escapeEditComment()} className={styles.close} />
               ) : (
                  <div>
                     {comment?.user?.id === activeUser?.id ? (
                        <Edit onClick={() => setEditMode(!editMode)} className={styles.commenticon} />
                     ) : (
                        <></>
                     )}
                     <Copy className={styles.commenticon} onClick={copyCommentLink} />
                     {comment?.user?.id === activeUser?.id ? (
                        <Delete onClick={deleteCommentHandler} className={styles.commenticon} />
                     ) : (
                        <></>
                     )}
                  </div>
               )}
            </div>
            {editMode ? (
               <CommentForm
                  editableComment={comment}
                  submitType={'edit'}
                  activeUser={activeUser}
                  comments={allComments}
                  fileList={commentFiles || []}
                  changeFilesInState={setCommentFiles}
                  setComments={setComments}
                  closeEdit={setEditMode}
               />
            ) : (
               <div className={styles.text}>{parse(comment?.content || '<p>Описание задачи</p>')}</div>
            )}
            {!editMode ? (
               <div className={styles.preview}>
                  {commentFiles.map((file, index) => (
                     <FilePriview
                        key={index}
                        file={file}
                        files={commentFiles}
                        editMode={editMode}
                        inComment={true}
                        deleteFile={setCommentFiles}
                     />
                  ))}
               </div>
            ) : (
               <></>
            )}
         </div>
         {modal ? <InfoModal type={modalType} title={modalTitle} info={modalInfo} setClose={setCloseModal} /> : <></>}
      </>
   );
}
