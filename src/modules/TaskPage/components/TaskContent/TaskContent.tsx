import { ResponseFile, TaskSingle, User, Comment, Stage } from '@/api/data.types';
import styles from './task-modal.module.scss';
import CopyLink from '@public/icons/copy-task-link.svg';
import CommentComp from '../Comment/CommentComp';
import CommentForm from '../CommentForm/CommentForm';
import Edit from '@public/icons/task-edit.svg';
import Create from '@public/icons/task-create.svg';
import Delete from '@public/icons/task-delete.svg';
import Clock from '@public/icons/clock.svg';
import Calendar from '@public/icons/calendar.svg';
import parse from 'html-react-parser';
import MarkersTask from '../Markers/Markers';
import SelectCustom from '@/components/select_custom/SelectCustom';
import { useEffect, useState } from 'react';
import FileUploader from '../FileUploader.tsx/FileUploader';
import FilePriview from '../FilePreveiw/FilePreview';
import Link from 'next/link';
import InfoModal from '../InfoModal/InfoModal';
import { useModalInfo } from '@/hooks/useModalInfo';
import { TaskModalCreationEditing } from '@/modules/TaskModalCreationEditing/page';
import ModalClose from '@/components/modal_close/ModalClose';
import { useDeleteTaskMutation, useUpdateTaskMutation } from '@/api/appApi';
import { useRouter } from 'next/router';
import { projectsUrl } from '@/consts';

export default function TaskContent({
   projectSlug,
   task,
   activeUser,
   onClose,
   refetch,
   delTaskFunc,
   currentStage,
   taskRefetch,
}: {
   projectSlug: string;
   task: TaskSingle | undefined;
   activeUser: User | undefined;
   onClose?: CallableFunction;
   refetch?: CallableFunction;
   delTaskFunc?: (flag: boolean) => void;
   currentStage?: Stage;
   taskRefetch: CallableFunction;
}) {
   const isAdmin = activeUser?.is_admin;
   const [selectedOptionComp, setSelectedOptionComp] = useState<Stage | undefined>(task?.stage);
   const [deleteTask, { isError: deleteError }] = useDeleteTaskMutation();
   const [updateTask, {}] = useUpdateTaskMutation();
   const [projectSlag, setProjectSlag] = useState<string>('');
   const [taskIdEditTask, setTaskIdEditTask] = useState<number | undefined>();
   const [isOpenCreateTask, setIsOpenCreateTask] = useState(false);
   const [newTaskId, setNewTaskId] = useState<number | undefined>();
   const [newTaskFlag, setNewTaskFlag] = useState(false);
   const [files, setFiles] = useState<ResponseFile[]>(task?.files || []);
   const [filesComments, setFIlesComments] = useState<ResponseFile[]>([]);
   const [comments, setComments] = useState<Comment[]>(task?.comments || []);
   const [selectOptions, setSelectOptions] = useState<Stage[] | undefined>();
   const [isDeleteTaskModal, setDelTaskModal] = useState<boolean>(false);
   const modalInfo = useModalInfo();
   const router = useRouter();

   useEffect(() => {
      if (task?.possibleTaskNextStages) {
         setSelectOptions(task?.possibleTaskNextStages.filter((stage) => stage.id !== 101));
      }
   }, [task?.possibleTaskNextStages]);

   useEffect(() => {
      if (task?.stage?.name) {
         setSelectedOptionComp(task?.stage);
      }
      if (currentStage && currentStage.id !== task?.stage?.id) {
         setSelectedOptionComp(currentStage);
      }

      if (task?.files) {
         setFiles(task?.files);
      }
      if (task?.comments) {
         setComments(task?.comments);
      }
   }, [task?.stage?.name, task?.files, task?.comments, refetch]);

   useEffect(() => {
      if (task?.dev_link && selectedOptionComp && task?.stage?.id !== selectedOptionComp?.id) {
         updateTaskHandler(selectedOptionComp, task);
      } else if (task?.stage?.id !== selectedOptionComp?.id && !task?.dev_link) {
         modalInfo.setCloseModal(true);
         modalInfo.setModalTitle('Ошибка');
         modalInfo.setModalType('error');
         modalInfo.setModalInfo('Сначала добавьте Dev Link в меню редактирования задачи');
         refetch && refetch();
         taskRefetch();
         // task?.stage && setSelectedOptionComp(task?.stage);
      }
      if (deleteError) {
         modalInfo.setCloseModal(true);
         modalInfo.setModalTitle('Ошибка');
         modalInfo.setModalType('error');
         modalInfo.setModalInfo('Не удалось удалить задачу');
      }
   }, [selectedOptionComp, deleteError]);

   const copyLinkHandler = async () => {
      const link = window.location.href;
      if (window.location.pathname.split('/').length === 3) {
         await navigator.clipboard.writeText(window.location.href + '/' + task?.id);
      } else {
         await navigator.clipboard.writeText(window.location.href);
      }
      modalInfo.setCloseModal(true);
      modalInfo.setModalTitle('Успешно');
      modalInfo.setModalType('info');
      modalInfo.setModalInfo('Ссылка успешно скопирована');
   };

   const handlerNewTask = () => {
      setNewTaskFlag(true);
      setTaskIdEditTask(task?.id);
      setProjectSlag(projectSlug);
      setIsOpenCreateTask(!isOpenCreateTask);
   };

   const handlerEditTask = () => {
      setNewTaskFlag(false);
      setTaskIdEditTask(task?.id);
      setProjectSlag(projectSlug);
      setIsOpenCreateTask(!isOpenCreateTask);
   };

   const handleNewTaskId = (taskId: number) => {
      setNewTaskId(taskId);
   };

   const onConfirmHandlerModal = () => {
      setDelTaskModal(false);
   };

   const deleteTaskHandler = async () => {
      if (task?.id) {
         const taskDel = await deleteTask(task?.id);

         const response: TaskSingle | undefined = taskDel?.data?.data || undefined;

         if (response) {
            setNewTaskId(undefined);
            if (delTaskFunc) delTaskFunc(true);

            if (onClose) onClose(false);
            setDelTaskModal(false);
            modalInfo.setCloseModal(true);
         }
      } else {
         setDelTaskModal(false);
         modalInfo.setCloseModal(true);
         modalInfo.setModalTitle('Ошибка');
         modalInfo.setModalType('error');
         modalInfo.setModalInfo('Задача не найдена');
      }
   };

   const updateTaskHandler = async (stage: Stage, task: TaskSingle) => {
      const taskBody = {
         name: task.name,
         description: task.description,
         stage_id: stage.id,
         task_type_id: task.task_type?.id,
         component_id: task.component?.id,
         priority_id: task.priority?.id,
         block_id: task.block,
         release_id: task.release?.id,
         related_id: task.related,
         epic_id: task.epic?.id,
         estimate_cost: task.estimate_cost,
         estimate_worker: task.estimate_worker,
         layout_link: task.layout_link,
         markup_link: task.markup_link,
         dev_link: task.dev_link,
         executors: task.users?.map((user) => user.id),
         begin: task.begin,
         end: task.end,
      };
      if (task?.id && selectedOptionComp?.id !== currentStage?.id) {
         const result = await updateTask({ id: task.id, body: taskBody });
         if (result.data) {
            modalInfo.setCloseModal(true);
            modalInfo.setModalTitle('Успешно');
            modalInfo.setModalInfo('Статус задачи успешно изменен');
            refetch && refetch();
            // taskRefetch();
         } else {
            modalInfo.setModalType('error');
            modalInfo.setModalInfo('Не удалось изменить статус задачи');
            task?.stage && setSelectedOptionComp(task?.stage);
         }
      } else if (selectedOptionComp?.id === currentStage?.id) {
         taskRefetch();
         refetch && refetch();
      }
   };

   useEffect(() => {
      if (refetch) {
         refetch();
      }
   }, [isOpenCreateTask, refetch]);

   return (
      <>
         <div className={styles.content}>
            <div className={styles.flex}>
               <h2 className={styles.content_title}>{task?.name || 'Название задачи'}</h2>
               <CopyLink className={styles.content_copy} onClick={copyLinkHandler} />
            </div>
            <div className={styles.content_desc}>{parse(task?.description || '<p>Описание задачи</p>')}</div>
            <FileUploader
               isEdit={true}
               inForm={false}
               addFilesTOState={task?.can_attach_file ? setFiles : () => {}}
               fileList={files}
            />
            <div className={styles.content_preveiw}>
               {files.map((item, index) => (
                  <FilePriview
                     editMode={true}
                     deleteFile={setFiles}
                     files={files}
                     file={item}
                     key={index}
                     inComment={false}
                  />
               ))}
            </div>
            <CommentForm
               submitType="create"
               task={task}
               changeFilesInState={task?.can_attach_file ? setFIlesComments : () => {}}
               fileList={filesComments}
               activeUser={activeUser}
               comments={comments}
               setComments={setComments}
            />
            <div>
               {comments.map((item, index) => (
                  <CommentComp
                     allComments={comments}
                     setComments={setComments}
                     activeUser={activeUser}
                     comment={item}
                     key={index}
                  />
               ))}
            </div>
         </div>
         <div className={styles.aside}>
            <div className={`${styles.flex} ${styles.aside_box}`}>
               <p className="id">id: {task?.id || 'отсутсвует'}</p>
               <div>
                  <button onClick={handlerEditTask}>
                     <Edit className={styles.aside_icon} />
                  </button>
                  <button onClick={() => setDelTaskModal(true)}>
                     {isAdmin ? <Delete className={styles.aside_icon} /> : <></>}
                  </button>
                  <button onClick={handlerNewTask}>{isAdmin ? <Create className={styles.aside_icon} /> : <></>}</button>
               </div>
            </div>
            <SelectCustom
               maxWidth={'100%'}
               value={selectedOptionComp}
               onChange={(value) => setSelectedOptionComp(value)}
               titleSelect={`${selectedOptionComp || 'не задано'}`}
               options={selectOptions}
            />
            <div className={`${styles.flex} ${styles.aside_tabbox}`}>
               <MarkersTask priority={task?.priority} component={task?.component} type={task?.task_type} />
            </div>
            <div className={styles.flexcentre}>
               <span className={styles.aside_text}>Оценка</span>
               <div className={styles.flexcentre}>
                  <span className={styles.aside__textblack}>{task?.bugs_tracked_time || 0}ч</span>
                  <Clock className={styles.aside_clock} />
               </div>
            </div>
            <div className={styles.aside_infobox}>
               <div>
                  <p className={`${styles.aside_text} ${styles.pb8}`}>Дата создания</p>
                  <p className={styles.aside__textblack}>
                     <Calendar className={styles.aside_calendar} />
                     {new Intl.DateTimeFormat('ru-RU').format(new Date(task?.created_at || 0))}
                  </p>
               </div>
               <div>
                  <p className={`${styles.aside_text} ${styles.pb8}`}>Дата начала</p>
                  <p className={styles.aside__textblack}>
                     <Calendar className={styles.aside_calendar} />
                     {task?.date_start || 'нет'}
                  </p>
               </div>
            </div>
            <div className={styles.aside_infobox}>
               <div>
                  <p className={`${styles.aside_text} ${styles.pb8}`}>Эпик</p>
                  <p className={`${styles.aside_text} ${styles.pb8}`} style={{ color: '#3787eb' }}>
                     <span># </span>
                     <Link href={`${projectsUrl}/${projectSlug}/${task?.epic?.id}`}>
                        {task?.epic?.id} {task?.epic?.name}
                     </Link>
                  </p>
               </div>
            </div>
            <div className={styles.aside_infobox}>
               <div>
                  <p className={`${styles.aside_text} ${styles.pb8}`}>Исполнитель</p>
                  {task?.users &&
                     task.users.map((user, index) => (
                        <div key={index} className={styles.pb8} style={{ display: 'flex' }}>
                           <figure className={styles.avatarbox}>
                              {user.avatar?.link ? (
                                 <img src={`https://trainee-academy.devds.ru${user.avatar?.link}`} alt={user.name} />
                              ) : (
                                 <></>
                              )}
                           </figure>
                           <p style={{ paddingLeft: 8, flexBasis: '80%' }}>
                              {user.surname} {user.name} {user.patronymic}
                           </p>
                        </div>
                     ))}
               </div>
            </div>
            <div className={`${styles.aside_infobox} ${styles.pt16}`}>
               <div>
                  <p className={`${styles.aside_text} ${styles.pb8}`}>Постановщик</p>
                  {task?.created_by && (
                     <div className={styles.pb8} style={{ display: 'flex' }}>
                        <figure className={styles.avatarbox}>
                           {task?.created_by?.avatar?.link ? (
                              <img
                                 height={32}
                                 src={`https://trainee-academy.devds.ru${task?.created_by?.avatar?.link}`}
                                 alt={task?.created_by?.name}
                              />
                           ) : (
                              <></>
                           )}
                        </figure>
                        <p style={{ paddingLeft: 8, flexBasis: '80%' }}>
                           {task?.created_by?.surname} {task?.created_by?.name} {task?.created_by?.patronymic}
                        </p>
                     </div>
                  )}
               </div>
            </div>
            <div className={`${styles.aside_infobox} ${styles.pt16}`}>
               <div>
                  <p className={`${styles.aside_text} ${styles.pb8}`}>Layout Link</p>
                  <p className={styles.aside_text} style={{ color: '#3787eb' }}>
                     {task?.layout_link ? (
                        <Link href={`${task?.layout_link}`}>{task?.layout_link}</Link>
                     ) : (
                        <span>отсутсвует</span>
                     )}
                  </p>
               </div>
            </div>
            <div className={`${styles.aside_infobox} ${styles.pt16}`}>
               <div>
                  <p className={`${styles.aside_text} ${styles.pb8}`}>Dev Link</p>
                  <p className={styles.aside_text} style={{ color: '#3787eb' }}>
                     {task?.dev_link ? (
                        <Link href={`${task?.dev_link}`}>{task?.dev_link}</Link>
                     ) : (
                        <span>отсутсвует</span>
                     )}
                  </p>
               </div>
            </div>
            <div className={`${styles.aside_infobox} ${styles.pt16}`}>
               <div>
                  <p className={`${styles.aside_text} ${styles.pb8}`}>Markup Link</p>
                  <p className={styles.aside_text} style={{ color: '#3787eb' }}>
                     {task?.markup_link ? (
                        <Link href={`${task?.markup_link}`}>{task?.markup_link}</Link>
                     ) : (
                        <span>отсутсвует</span>
                     )}
                  </p>
               </div>
            </div>
            {modalInfo.modal ? (
               <InfoModal
                  type={modalInfo.modalType}
                  title={modalInfo.modalTitle}
                  info={modalInfo.modalInfo}
                  setClose={modalInfo.setCloseModal}
               />
            ) : (
               <></>
            )}
            {isOpenCreateTask && (
               <TaskModalCreationEditing
                  isOpen={isOpenCreateTask}
                  onClose={() => setIsOpenCreateTask(false)}
                  slugName={projectSlag}
                  taskId={taskIdEditTask}
                  newTaskId={newTaskId}
                  onNewTaskId={handleNewTaskId}
                  newTaskFlag={newTaskFlag}
                  taskRefetch={taskRefetch}
               />
            )}
            {isDeleteTaskModal && (
               <ModalClose
                  title="Удалить задачу"
                  isOpen={isDeleteTaskModal}
                  onConfirm={onConfirmHandlerModal}
                  onClose={deleteTaskHandler}
               />
            )}
         </div>
      </>
   );
}
