import React, { useState, useEffect } from 'react';
import { useModalInfo } from '@/hooks/useModalInfo';
import InfoModal from '@/modules/TaskPage/components/InfoModal/InfoModal';
import Close from '@public/icons/close.svg';
import style from '@/modules/TaskModalCreationEditing/task-modal-creation-editing.module.scss';
import ModalClose from '@/components/modal_close/ModalClose';
import SelectCustom from '@/components/select_custom/SelectCustom';
import SelectCustomCheckbox from '@/components/select_custom_checkbox/select-custom-checkbox';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '@/modules/TaskModalCreationEditing/utils/validationSchema';
import CalendarCustom from '@/components/calendar_custom/CalendarCustom';
import TextAreaWithToolbar from '@/components/text_area_with_toolbar/TextAreaWithToolbar';
import FileUpload from '@/components/file_upload/FileUpload';
import { useGetComponentsQuery } from '@/modules/TaskModalCreationEditing/api/taskApiActions';

import { useGetTaskPrioritiesQuery, useGetTaskTypesQuery } from '@/api/tasks/tasks.api';
import {
   useGetTaskByTaskIdQuery,
   useCreateTaskMutation,
   useUpdateTaskMutation,
   useAddFilesToTaskMutation,
   useGetUsersQuery,
   useGetAllTasksQuery,
} from '@/api/appApi';
import { Priority, TaskMultiple, TaskSingle, TaskType, User, ResponseFile, Component } from '@/api/data.types';
import {
   typesTasksOptions,
   compOptions,
   priorOptions,
   usersOptions,
} from '@/modules/TaskModalCreationEditing/variors/variors';
import { transformToServerData } from '@/modules/TaskModalCreationEditing/utils/transformToServerData';
import { parseEstimate } from '@/modules/TaskModalCreationEditing/utils/parseEstimate';
import { extractTextFromHtml } from '@/modules/TaskModalCreationEditing/utils/extractTextFromHtml';

interface TaskModalCreationEditingProps {
   isOpen: boolean;
   onClose: () => void;
   slugName: string;
   taskId?: number;
   newTaskId: number | undefined;
   onNewTaskId: (taskId: number) => void;
   newTaskFlag: boolean;
   taskRefetch?: CallableFunction;
}

export interface CustomFormData {
   name?: string;
   stage_id: number;
   component_id: number;
   block_id: number;
   epic_id: number;
   release_id: number;
   related_id: number;
   estimate_cost: number;
   selectedOptionTasks?: TaskType;
   selectedOptionComp?: Component;
   selectedOptionsCheckbox?: User[];
   selectedOptionPriority?: Priority;
   estimateMinutes?: string;
   estimate?: string | number;
   date?: {
      startDate?: string | null;
      endDate?: string | null;
   };
   description?: string;
   fileLinks?: ResponseFile[];
   layoutLink?: string | null;
   markupLink?: string | null;
   devLink?: string | null;
   handleSubmit: () => void;
}

export function TaskModalCreationEditing({
   isOpen,
   onClose,
   slugName,
   taskId,
   newTaskId,
   onNewTaskId,
   newTaskFlag,
   taskRefetch,
}: TaskModalCreationEditingProps) {
   const modalInfo = useModalInfo();
   const isEditMode = Boolean(taskId);

   const [taskData, setTaskData] = useState<TaskSingle | undefined>(undefined);

   // const [selectedOptionTasks, setSelectedOptionTasks] = useState<TaskType | undefined>(undefined);
   // const [selectedOptionComp, setSelectedOptionComp] = useState<Component | undefined>(undefined);
   // const [selectedPriority, setSelectedPriority] = useState<Priority | undefined>(undefined);
   // const [selectedOptionUsers, setSelectedOptionUsers] = useState<User[]>([]);

   const [files, setFiles] = useState<ResponseFile[]>([]);
   const [idTaskMain, setIdTaskMain] = useState<number | undefined>(taskId);
   const [isModalOpen, setModalOpen] = useState(false);

   const [taskTypesOptions, setTaskTypesOptions] = useState(typesTasksOptions);
   const [componentsOptions, setComponentsOptions] = useState(compOptions);
   const [priorityOptions, setPriorityOptions] = useState(priorOptions);
   const [users, setUsersOptions] = useState(usersOptions);

   const [updateErrors, setUpdateErrors] = useState('');
   const [createErrors, setCreateErrors] = useState('');

   const [sendFilesTaskMutation] = useAddFilesToTaskMutation();
   const { data: getComponents } = useGetComponentsQuery();
   const { data: getPriorities } = useGetTaskPrioritiesQuery();
   const { data: getTaskTypes } = useGetTaskTypesQuery(undefined, {
      skip: !!taskId || isOpen,
   });

   const { data: getUsers } = useGetUsersQuery(slugName);

   const [createTaskMutation, { isLoading: isCreateLoading, isSuccess: createIsSuccess, error: createError }] =
      useCreateTaskMutation();

   const [updateTaskMutation, { isLoading: isUpdateLoading, isSuccess: updateIsSuccess, error: updateError }] =
      useUpdateTaskMutation();

   const {
      data: taskById,
      isLoading: isGetTaskByTaskIdLoading,
      isSuccess: isGetTaskByTaskIdIsSuccess,
      refetch,
   } = useGetTaskByTaskIdQuery(idTaskMain !== undefined ? idTaskMain : 27, {
      refetchOnMountOrArgChange: true,
      skip: !taskId || !isOpen,
   });

   const handleFileTaskLinked = async (idTask: number | undefined, filesTask: ResponseFile[] | undefined) => {
      if (idTask === undefined) return;

      try {
         if (filesTask && filesTask.length > 0) {
            for (const file of filesTask) {
               if (file && file.id !== undefined) {
                  const response = await sendFilesTaskMutation({
                     task: idTask,
                     file: file.id,
                  }).unwrap();

                  const taskDataResponse: TaskSingle = response.data;

                  if (taskDataResponse?.files) {
                     setTaskData(taskDataResponse);

                     setFiles(taskDataResponse.files ?? []);
                  } else {
                     // console.warn('Файлы отсутствуют в ответе для задачи:', taskDataResponse);
                  }
               } else {
                  // console.warn(`Файл пропущен, так как у него отсутствует id:`, file);
               }
            }
         } else {
            // console.warn('Нет файлов для привязки.');
         }
      } catch (error) {
         // console.error('Ошибка при привязке файла:', error);
      }
   };

   const handleUpdateTask = async (
      idTask: number | undefined,
      taskDataUpd: TaskMultiple,
      filesTask: ResponseFile[]
   ) => {
      if (!idTask) return;

      try {
         const response = await updateTaskMutation({
            id: idTask,
            body: taskDataUpd,
         }).unwrap();

         const taskDataResponse: TaskSingle = response?.data;
         taskRefetch && taskRefetch();
         if (taskDataResponse) {
            setTaskData((prev) => ({
               ...prev,
               ...taskDataResponse,
            }));

            if (taskDataResponse.files) {
               if (taskDataResponse.files.length > 0) setFiles(taskDataResponse.files);
            }

            const taskId: number | undefined = taskDataResponse.id;

            if (filesTask && filesTask?.length > 0) {
               const uniqueFilesTask: ResponseFile[] = filesTask.filter(
                  (newFile: ResponseFile | null) =>
                     !taskData?.files?.some((existingFile: ResponseFile | null) => {
                        if (existingFile != null && newFile != null)
                           return (
                              existingFile.id === newFile.id ||
                              existingFile.original_name === newFile.original_name ||
                              existingFile.link === newFile.link
                           );
                     })
               );

               if (uniqueFilesTask?.length > 0) {
                  await handleFileTaskLinked(taskId, uniqueFilesTask);
               }
            }
         }

         if (response) {
            onClose();
         }
      } catch (error) {
         setUpdateErrors('Ошибка при обновлении задачи');
      }
   };

   const handleCreateTask = async (slugName: string, taskData: TaskMultiple, files: ResponseFile[]) => {
      try {
         const response = await createTaskMutation({
            slug: slugName,
            body: taskData,
         }).unwrap();

         const taskDataResponse: TaskSingle = response.data;

         if (taskDataResponse) {
            setTaskData(taskDataResponse);

            if (taskDataResponse.files) {
               if (taskDataResponse.files.length > 0) setFiles(taskDataResponse.files);
            }
            const taskId: number | undefined = taskDataResponse.id;

            if (taskId) {
               onNewTaskId(taskId);
               setIdTaskMain(taskId);
            }

            const idTask = taskDataResponse?.id;

            if (files?.length > 0 && (idTask || idTaskMain) && taskDataResponse.can_attach_file) {
               // && taskDataResponse.can_attach_file - помечено как устаревшее
               await handleFileTaskLinked(idTask, files);
            }
         }

         if (response) {
            onClose();
         }
      } catch (error) {
         setCreateErrors('Ошибка при создании задачи');
      }
   };

   const {
      register,
      reset,
      handleSubmit,
      control,
      setValue,
      watch,
      formState: { errors },
      clearErrors,
   } = useForm<CustomFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: taskData?.name || '',
         selectedOptionTasks: taskData?.task_type || { id: 0, name: '' },
         selectedOptionComp: taskData?.component || { id: 0, name: '', color: '' },
         selectedOptionsCheckbox: taskData?.users || [],
         selectedOptionPriority: taskData?.priority || { id: 0, name: '' },
         stage_id: 0,
         component_id: 0,
         block_id: 0,
         epic_id: 0,
         release_id: 0,
         estimateMinutes: '',
         estimate: taskData?.estimate_worker || '',
         date: {
            startDate: taskData?.begin ? new Date(taskData.begin).toISOString() : '',
            endDate: taskData?.end ? new Date(taskData.end).toISOString() : '',
         },
         description: taskData?.description || '',
         fileLinks: taskData?.files || [],
         layoutLink: taskData?.layout_link || '',
         markupLink: taskData?.markup_link || '',
         devLink: taskData?.dev_link || '',
      },
   });

   const handleCloseModal = () => {
      onClose();
      setModalOpen(false);
   };

   const handleConfirm = () => {
      setModalOpen(false);
   };

   const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
         setModalOpen(true);
      }
   };

   const handleTaskTypeChange = (value: TaskType | undefined) => {
      setValue('selectedOptionTasks', value);
   };

   const handleComponentChange = (value: Component | undefined) => {
      setValue('selectedOptionComp', value);
   };

   const handleUsersChange = (value: User[]) => {
      setValue('selectedOptionsCheckbox', value);
   };

   const handlePriorityChange = (value: Priority | undefined) => {
      setValue('selectedOptionPriority', value);
      clearErrors('selectedOptionPriority');
   };

   const onBlurFilesChange = (e: React.FocusEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const parsed = parseEstimate(rawValue);
      setValue('estimate', parsed, { shouldValidate: false });
      setValue('estimateMinutes', rawValue, { shouldValidate: true });
   };

   const handleFilesChange = (newFiles: ResponseFile[] | undefined): void => {
      setValue('fileLinks', newFiles);
      setFiles(newFiles as ResponseFile[]);
   };

   const onSubmit = (data: CustomFormData) => {
      const serverData: TaskMultiple = transformToServerData(data);

      if (data !== undefined) {
         const fileLinks = data.fileLinks ?? [];
         if (serverData && newTaskFlag) {
            modalInfo.setCloseModal(false);
            setCreateErrors('');

            handleCreateTask(slugName, serverData, fileLinks);
         }

         if (serverData && isEditMode && !newTaskFlag) {
            modalInfo.setCloseModal(false);
            setUpdateErrors('');
            handleUpdateTask(idTaskMain, serverData, fileLinks);
         } else {
            modalInfo.setCloseModal(true);
            modalInfo.setModalTitle('Неудача');
            modalInfo.setModalInfo('Ошибка id задачи');
            modalInfo.setModalType('error');
         }
      }
   };

   useEffect(() => {
      if (getComponents) setComponentsOptions(getComponents.data || []);
      if (getPriorities) setPriorityOptions(getPriorities.data || []);

      if (taskId && taskData) setTaskTypesOptions(taskData?.possibleTaskNextStages || []);
      if (!taskId && getTaskTypes?.data) {
         setTaskTypesOptions(getTaskTypes.data || []);
      }
      if (!taskId && !getTaskTypes?.data) {
         setTaskTypesOptions(typesTasksOptions);
      }

      if (getUsers) setUsersOptions(getUsers.data || []);
   }, [getTaskTypes, getComponents, getPriorities, getUsers, taskData]);

   useEffect(() => {
      if (taskById?.data) {
         setTaskData(taskById?.data);
         setFiles((taskById?.data?.files || []) as ResponseFile[]);
      }
   }, [taskById?.data]);

   useEffect(() => {
      if (taskId) setIdTaskMain(taskId);
      if (taskId && taskById) setTaskData(taskById?.data);
      if (taskData?.files) setFiles(taskData.files as ResponseFile[]);
   }, [isOpen, taskId, taskById, taskData?.files]);

   useEffect(() => {
      if (updateErrors || createErrors) {
         modalInfo.setCloseModal(true);
         modalInfo.setModalTitle('Неудача');
         modalInfo.setModalType('error');
      }

      if (updateErrors) {
         modalInfo.setModalInfo(updateErrors || 'Ошибка');
      }
      if (createErrors) {
         modalInfo.setModalInfo(createErrors || 'Ошибка');
      }
   }, [updateErrors, createErrors]);

   useEffect(() => {
      if (taskData) {
         const updatedFiles = taskData?.files || [];
         setFiles(updatedFiles as ResponseFile[]);

         if (taskData) {
            const descriptionText = taskData.description ? extractTextFromHtml(taskData.description) : '';

            reset({
               ...taskData,
               name: taskData.name || '',
               selectedOptionTasks:
                  typeof taskData.task_type === 'number'
                     ? { id: taskData.task_type, name: '' }
                     : taskData.task_type || { id: 0, name: '' },
               selectedOptionComp: taskData.component || {
                  id: 0,
                  name: '',
                  color: '',
               },
               selectedOptionsCheckbox: taskData.users || [],
               selectedOptionPriority:
                  typeof taskData.priority === 'number'
                     ? { id: taskData.priority, name: '' }
                     : taskData.priority || { id: 0, name: '' },
               stage_id: 0,
               component_id: 0,
               block_id: 0,
               epic_id: 0,
               release_id: 0,
               estimateMinutes: '',
               estimate: '',
               date: {
                  startDate: taskData.begin ? new Date(taskData.begin).toISOString() : null,
                  endDate: taskData.end ? new Date(taskData.end).toISOString() : null,
               },
               description: descriptionText,
               fileLinks: updatedFiles,
               layoutLink: taskData.layout_link || '',
               markupLink: taskData.markup_link || '',
               devLink: taskData.dev_link || '',
            });
         }
      }
   }, [taskData, reset, taskData?.files]);

   if (!isOpen) return null;
   if (isGetTaskByTaskIdLoading) return <div className={style.loading}>Загрузка...</div>;

   return (
      <div className={style['modal-creation-editing']} onClick={handleOverlayClick}>
         <button className={style['close-button-modal']} type="button" onClick={() => setModalOpen(true)}>
            <Close />
         </button>

         <div className={style.wrapper}>
            <div className={style.header}>
               <h2 className={style.title}>{newTaskFlag ? 'Создать задачу' : 'Редактировать задачу'}</h2>

               <button className={style['close-button']} type="button" onClick={() => setModalOpen(true)}>
                  <Close />
               </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
               <div className={`${style['form-title']} ${errors.name ? style['error-title'] : ''}`}>
                  <label>
                     Название <span>*</span>
                  </label>
                  <input {...register('name')} className={style['form-input']} placeholder="Название" />
                  {errors.name && <p className={style.error}>{errors.name.message}</p>}
               </div>

               <div className={style['form-selects']}>
                  <div className={style['form-select']}>
                     <SelectCustom<TaskType>
                        value={watch('selectedOptionTasks')}
                        onChange={handleTaskTypeChange}
                        options={taskTypesOptions}
                        label="Тип задачи"
                        titleSelect="Задача"
                        required
                        errors={errors.selectedOptionTasks?.message}
                     />
                     {errors.selectedOptionTasks && <p className={style.error}>{errors.selectedOptionTasks.message}</p>}
                  </div>

                  <div className={style['form-select']}>
                     <SelectCustom<Component>
                        value={watch('selectedOptionComp')}
                        onChange={handleComponentChange}
                        options={componentsOptions}
                        label="Компонент"
                        titleSelect="Не выбран"
                        required
                        errors={errors.selectedOptionComp?.message}
                     />
                     {errors.selectedOptionComp && <p className={style.error}>{errors.selectedOptionComp.message}</p>}
                  </div>

                  <div className={style['form-select']}>
                     <SelectCustomCheckbox
                        value={watch('selectedOptionsCheckbox') || []}
                        onChange={handleUsersChange}
                        options={users || []}
                        label="Исполнитель"
                        titleSelect="Исполнитель"
                        required
                     />
                     {errors.selectedOptionsCheckbox && (
                        <p className={style.error}>{errors.selectedOptionsCheckbox.message}</p>
                     )}
                  </div>
               </div>

               <div className={style['form-selects']}>
                  <div className={style['form-select']}>
                     <SelectCustom<Priority>
                        value={watch('selectedOptionPriority')}
                        onChange={handlePriorityChange}
                        options={priorityOptions || []}
                        label="Приоритет"
                        titleSelect="Приоритет"
                        required
                        errors={errors.selectedOptionPriority?.message}
                     />

                     {errors.selectedOptionPriority && (
                        <p className={style.error}>{errors.selectedOptionPriority.message}</p>
                     )}
                  </div>

                  <div className={style['form-select']}>
                     <label>Оценка</label>
                     <input
                        {...register('estimate')}
                        onBlur={onBlurFilesChange}
                        className={style['form-input']}
                        type="text"
                        placeholder="Оценка"
                     />
                     {errors.estimateMinutes && <p className={style.error}>{errors.estimateMinutes.message}</p>}
                  </div>
               </div>

               <div className={style['form-date-start']}>
                  <Controller
                     name="date"
                     control={control}
                     render={({ field }) => (
                        <CalendarCustom
                           value={{
                              startDate: field.value?.startDate ?? undefined,
                              endDate: field.value?.endDate ?? undefined,
                           }}
                           onChange={field.onChange}
                        />
                     )}
                  />

                  {errors.date && <p className={style.error}>{errors.date.message}</p>}
               </div>

               <div className={style['form-description']}>
                  <Controller
                     name="description"
                     control={control}
                     render={({ field }) => (
                        <TextAreaWithToolbar
                           value={field.value}
                           onChange={field.onChange}
                           error={errors.description?.message}
                        />
                     )}
                  />

                  {errors.description && <p className={style.error}>{errors.description.message}</p>}
               </div>

               <div className={style['form-files']}>
                  <Controller
                     name="fileLinks"
                     control={control}
                     render={({ field: { value = [], onChange }, fieldState: { error } }) => (
                        <FileUpload
                           taskId={idTaskMain}
                           files={files || []}
                           onFilesChange={(newFiles: ResponseFile[] | undefined) => {
                              onChange(newFiles);
                              if (handleFilesChange) {
                                 handleFilesChange(newFiles);
                              }
                           }}
                           disabled={!taskData?.can_attach_file}
                           error={error?.message}
                           isSuccess={isGetTaskByTaskIdIsSuccess}
                           refetch={refetch}
                        />
                     )}
                  />
               </div>

               <div className={style['form-links-files']}>
                  <div className={style['form-link-item']}>
                     <label>Layout Link</label>
                     <Controller
                        name="layoutLink"
                        control={control}
                        render={({ field }) => (
                           <input
                              type="text"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder="Layout link"
                           />
                        )}
                     />
                     {errors.layoutLink && <p className={style.error}>{errors.layoutLink.message}</p>}
                  </div>

                  <div className={style['form-link-item']}>
                     <label>Markup Link</label>
                     <Controller
                        name="markupLink"
                        control={control}
                        render={({ field }) => (
                           <input
                              type="text"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder="Markup link"
                           />
                        )}
                     />
                     {errors.markupLink && <p className={style.error}>{errors.markupLink.message}</p>}
                  </div>

                  <div className={style['form-link-item']}>
                     <label>Dev Link</label>
                     <Controller
                        name="devLink"
                        control={control}
                        render={({ field }) => (
                           <input
                              type="text"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder="Dev link"
                           />
                        )}
                     />
                     {errors.devLink && <p className={style.error}>{errors.devLink.message}</p>}
                  </div>
               </div>

               <div className={style['actions']}>
                  <button type="submit" className={style['btn_blue']} onClick={() => onSubmit}>
                     {newTaskFlag ? 'Добавить' : 'Сохранить'}
                  </button>
                  <button className={style['btn']} type="button" onClick={() => onClose()}>
                     Отменить
                  </button>
               </div>
            </form>
         </div>

         <ModalClose title="Закрыть окно?" isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirm} />

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
      </div>
   );
}
