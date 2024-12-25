import Bold from '@public/icons/fs-bold.svg';
import Italic from '@public/icons/fs-italic.svg';
import Code from '@public/icons/fs-code.svg';
import OlMarker from '@public/icons/fs-marker.svg';
import UlMarker from '@public/icons/fs-marker-num.svg';
import styles from './commform.module.scss';
import FileUploader from '../FileUploader.tsx/FileUploader';
import { ResponseFile, TaskSingle, User, Comment } from '@/api/data.types';
import { FormEvent, useEffect, useRef, useState, FocusEvent, KeyboardEvent } from 'react';
import FilePriview from '../FilePreveiw/FilePreview';
import { useCreateCommentMutation, usePatchCommentMutation } from '@/api/appApi';
import { commentFormatter } from '@/utils/taskUtils';
import InfoModal from '../InfoModal/InfoModal';
import { useModalInfo } from '@/hooks/useModalInfo';

export default function CommentForm({
   task,
   changeFilesInState,
   fileList,
   activeUser,
   comments,
   editableComment,
   setComments,
   submitType,
   closeEdit,
}: {
   task?: TaskSingle | undefined;
   changeFilesInState: CallableFunction;
   fileList: ResponseFile[];
   activeUser: User | undefined;
   comments?: Comment[];
   editableComment?: Comment;
   setComments?: CallableFunction;
   submitType: 'create' | 'edit';
   closeEdit?: CallableFunction;
}) {
   const [value, setValue] = useState('');
   const [bold, setBold] = useState('icon');
   const [italic, setItalic] = useState('icon');
   const [code, setCode] = useState('icon');
   const [olMarker, setOl] = useState('icon');
   const [ulMarker, setUl] = useState('icon');
   const [currentEl, setCurrent] = useState<HTMLElement>();
   const [placeholder, setPlaceholder] = useState<string>('block');
   const commentRef = useRef<HTMLDivElement>(null);

   const { modal, modalInfo, modalTitle, modalType, setModalInfo, setModalTitle, setModalType, setCloseModal } =
      useModalInfo();

   const [createComment, { isError: createCommentError }] = useCreateCommentMutation();
   const [patchComment, { isError: patchCommentError }] = usePatchCommentMutation();

   useEffect(() => {
      if (submitType === 'edit' && editableComment?.content && commentRef.current) {
         setValue((commentRef.current.innerHTML = editableComment?.content));
      }
      if (submitType === 'create') {
         const p = document.createElement('p');
         p.className = 'editable';
         p.innerHTML = '<br>';
         if (!commentRef.current) return;
         commentRef.current.append(p);
      }
   }, []);

   useEffect(() => {
      if (commentRef.current?.lastChild instanceof HTMLParagraphElement) {
         setCurrent(commentRef.current?.lastChild);
      }
      if (commentRef.current?.lastChild?.lastChild instanceof HTMLLIElement) {
         setCurrent(commentRef.current?.lastChild?.lastChild);
      }
   }, [commentRef.current?.lastChild, commentRef.current?.lastChild?.lastChild]);

   useEffect(() => {
      if (createCommentError) {
         setModalType('error');
         setModalTitle('Ошибка');
         setModalInfo('Не удалось создать комментарий');
         setCloseModal(true);
      }
      if (patchCommentError) {
         setModalType('error');
         setModalTitle('Ошибка');
         setModalInfo('Не удалось изменить комментарий');
         setCloseModal(true);
      }
   }, [createCommentError, patchCommentError]);

   const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (value.length === 0) {
         setModalType('error');
         setModalTitle('Предупреждение');
         setModalInfo('Для отправки комментария необходимо добавить описание');
         setCloseModal(true);
         return;
      }
      if (comments && setComments && submitType === 'create') {
         const comment = commentFormatter(value, activeUser, fileList);
         const sendFilesIds = comment.files?.map((file) => (typeof file?.id === 'number' ? file?.id : -1));
         if (task?.id && comment.content && sendFilesIds) {
            const paylord = await createComment({ id: task?.id, content: comment.content, files: sendFilesIds });
            comment.id = paylord.data?.data.id;
            setComments([comment, ...comments]);
            resetCommentFields();
         }
      } else if (submitType === 'edit') {
         if (!editableComment?.id || !comments || !setComments) return;
         const sendFilesIds = fileList.map((file) => (typeof file?.id === 'number' ? file.id : -1));
         const paylord = await patchComment({ id: editableComment?.id, content: value, files: sendFilesIds });
         console.log(paylord.data?.data);
         const comm: Comment = {
            id: editableComment.id,
            content: value,
            files: fileList,
            user: editableComment.user,
            created_at: editableComment.created_at,
            updated_at: new Date(Date.now()).toDateString(),
         };
         const res = [comm, ...comments.filter((item) => item.id !== editableComment.id)];
         setComments(res);
         closeEdit && closeEdit(false);
      }
   };

   const resetCommentFields = () => {
      if (!commentRef.current) return;
      commentRef.current.innerHTML = '<p class="editable"><br></p>';
      setPlaceholder('block');
      setBold('icon');
      setItalic('icon');
      setCode('icon');
      setUl('icon');
      setOl('icon');
      setValue('');
      changeFilesInState([]);
   };

   const setFocus = (elem: HTMLElement) => {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(elem);
      range.collapse(false);
      if (selection) {
         selection.removeAllRanges();
         selection.addRange(range);
      }
   };

   const textStyleHandler = (elState: string, tagName: string, setElState: CallableFunction) => {
      if (!commentRef.current) return;
      if (!commentRef.current.lastElementChild) return;
      if (elState === 'icon') {
         const element = document.createElement(tagName);
         element.className = `editable ${tagName}`.toLowerCase();
         element.innerHTML = '&nbsp;';
         currentEl?.append(element);
         setCurrent(element);
         setFocus(element);
         setElState('activeicon');
      } else if (elState === 'activeicon') {
         const elem = commentRef.current.lastElementChild;
         if (elem instanceof HTMLParagraphElement) {
            elem.innerHTML += '&nbsp;';
            setFocus(elem);
            setCurrent(elem);
         } else if (elem.lastChild instanceof HTMLLIElement) {
            elem.lastChild.innerHTML += '&nbsp;';
            setFocus(elem.lastChild);
            setCurrent(elem.lastChild);
         }
         setBold('icon');
         setItalic('icon');
         setCode('icon');
      }
   };

   const listTypeHandler = (listType: 'OL' | 'UL', listState: string) => {
      if (!commentRef.current) return;
      if (listState === 'icon') {
         const list = document.createElement(listType);
         const li = document.createElement('li');
         li.innerHTML = '<br>';
         li.className = `editable item-${listType}`.toLowerCase();
         list.append(li);
         commentRef.current.append(list);
         setCurrent(li);
         setFocus(list);
         setBold('icon');
         setItalic('icon');
         setCode('icon');
         listType === 'UL' ? setOl('icon') : setUl('icon');
         listType === 'UL' ? setUl('activeicon') : setOl('activeicon');
      } else if (listState === 'activeicon') {
         const p = document.createElement('p');
         const elem = commentRef.current;
         p.className = 'editable';
         p.innerHTML += '<br>';
         elem.append(p);
         setFocus(p);
         setBold('icon');
         setItalic('icon');
         setCode('icon');
         setUl('icon');
         setOl('icon');
      }
   };

   const inputHandler = (e: FormEvent<HTMLDivElement>) => {
      if (e.target instanceof HTMLDivElement) {
         setValue(e.target.innerHTML);
      }
   };

   const focusHandler = () => {
      setPlaceholder('none');
   };

   const keyDownHandler = (e: KeyboardEvent<HTMLDivElement>) => {
      if (!commentRef.current) return;
      if (e.key === 'Backspace' && commentRef.current.innerHTML === '<p class="editable"><br></p>') {
         e.preventDefault();
      }
   };

   return (
      <>
         <form onSubmit={(e) => submitHandler(e)}>
            <div className={styles.comments}>
               <h3 className={styles.commtitle}>Комментарии</h3>
               <div className={styles.commstyler}>
                  <Bold className={styles[bold]} onClick={() => textStyleHandler(bold, 'STRONG', setBold)} />
                  <Italic className={styles[italic]} onClick={() => textStyleHandler(italic, 'EM', setItalic)} />
                  <Code className={styles[code]} onClick={() => textStyleHandler(code, 'CODE', setCode)} />
                  <OlMarker className={styles[olMarker]} onClick={() => listTypeHandler('OL', olMarker)} />
                  <UlMarker className={styles[ulMarker]} onClick={() => listTypeHandler('UL', ulMarker)} />
               </div>
               <div>
                  <div
                     ref={commentRef}
                     spellCheck="true"
                     className={styles.texterea}
                     contentEditable={true}
                     onInput={(e) => inputHandler(e)}
                     onFocus={focusHandler}
                     onKeyDown={(e) => keyDownHandler(e)}
                  ></div>
                  <p className="editable placeholder" style={{ display: placeholder }}>
                     Описание
                  </p>
               </div>
            </div>
            <FileUploader
               isEdit={submitType === 'edit'}
               inForm={true}
               addFilesTOState={changeFilesInState}
               fileList={fileList}
               commentId={editableComment?.id}
            />
            <div className={styles.preveiw_box}>
               {fileList ? (
                  fileList.map((item, index) => (
                     <FilePriview
                        editMode={true}
                        files={fileList}
                        deleteFile={changeFilesInState}
                        inComment={true}
                        file={item}
                        key={index}
                     />
                  ))
               ) : (
                  <></>
               )}
            </div>
            <button className={styles.submitter} type="submit">
               Отправить
            </button>
         </form>
         {modal ? <InfoModal type={modalType} title={modalTitle} info={modalInfo} setClose={setCloseModal} /> : <></>}
      </>
   );
}
