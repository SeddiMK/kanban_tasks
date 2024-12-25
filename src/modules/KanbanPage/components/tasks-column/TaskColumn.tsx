import { Stage, TaskMultiple, ValidationError } from '@/api/data.types';
import { tasksApi, useGetAllTasksQuery, useLazyGetAllTasksQuery, useLazyGetTaskQuery, useUpdateTaskMutation } from '@/api/tasks/tasks.api';
import InfoModal from '@/modules/TaskPage/components/InfoModal/InfoModal';
import { useRouter } from 'next/router';
// import { useDroppable } from '@dnd-kit/core';
import { LegacyRef, PropsWithChildren, useState } from 'react';
import { useDrop } from 'react-dnd';
import style from '../../kanban-page.module.scss';

export function TasksColumn({
   children,
   stage,
   tasksAmount,
   // tasks,
}: { stage: Stage; tasksAmount: number; tasks?: TaskMultiple[] } & PropsWithChildren) {
   //
   // const { isOver, setNodeRef } = useDroppable({
   //    id: stage.id || 'droppable',
   // });

   const router = useRouter();

   const [warn, setWarn] = useState<{ modalType?: 'info' | 'error'; title: string, details: string } | null>(null);

   // const [getTasks, tasks] = useLazyGetAllTasksQuery();   
   const [getTask, _droppedTasks] = useLazyGetTaskQuery();
   const [updateTask, _result] = useUpdateTaskMutation({
      fixedCacheKey: 'shared-update-task',
   });

   /**
    * @description - работает некорректно на leave hover
    */
   const [isOver, setOver] = useState(false);

   // const dropstyle = {
   //    backgroundColor: isOver ? 'lightgray' : 'red',
   // };

   const [collectedProps, drop] = useDrop(() => ({
      accept: 'text',
      hover(item, monitor) {
         //   console.log(item, stage.name, monitor.isOver());
         //   setOver(monitor.isOver());
      },
      drop(item, monitor) {         
         // кэширует ли?
         getTask((item as { id: number }).id.toString()).then(({ data: taskInfo }) => {
            const { data: task } = taskInfo || {};

            // validate
            if (stage.id as number > 1 && !task?.dev_link) {
               setWarn({
                  details: 'Сначала добавьте Dev Link в меню редактирования задачи',
                  title: 'Ошибка',

               });
               return;               
            }

            if ((stage.id as number) > 1 && !task?.dev_link) {
               setWarn({
                  details: 'Сначала добавьте Dev Link в меню редактирования задачи',
                  title: 'Ошибка',
               });
               return;
            }

            updateTask({
               id: task?.id as number,
               stage_id: stage.id,
               projectslug: router.query['project-slug'] as string,
            }).then((e) => {
               if ('error' in e) {
                  const { data: error } = e.error as { data: ValidationError };
                  console.warn(error);
                  // alert(Object.values(error.errors as Record<string, string[]>)[0] || error.message);
               } 
               else {
                  // setWarn({
                  //    details: 'Статус задачи успешно изменен',
                  //    title: 'Успешно',
                  //    modalType: 'info',
                  // });
               }
            });
         });
      },
   }));

   return (
      <div className="col" ref={drop as unknown as LegacyRef<HTMLDivElement>}>
         <h4 data-count={tasksAmount}>{stage.name}</h4>
         {/* style={dropstyle} */}
         <div className={style.tasks}>{children}</div>

         {warn ? (
            <InfoModal
               type={warn?.modalType || 'error'}
               title={warn?.title}
               info={warn?.details}
               setClose={setWarn}
            />
         ) : (
            <></>
         )}
      </div>
   );
}






// const { data } = tasksApi.endpoints.getAllTasks.useQuery('');  // <- raw data
// const { data } = tasksApi.useGetAllTasksQuery(router.query['project-slug']);        // -//- via slice object (== via s/m)
// const [updatePost, { data }] = api.endpoints.updatePost.useMutation()