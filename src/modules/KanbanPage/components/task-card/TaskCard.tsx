import { TaskMultiple } from '@/api/data.types';
import { store, TypeRootState as GlobalState, TypeRootState } from '@/store/store';
// import { useDraggable } from '@dnd-kit/core';
import { LegacyRef, useEffect, useMemo } from 'react';
// import { RootState } from '@reduxjs/toolkit/dist/query/react';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import style from './task-card.module.scss';
import { groupBy } from '../../../../utils/core';
import { useGetTaskPrioritiesQuery, useGetTaskTagsQuery, useGetTaskTypesQuery } from '@/api/tasks/tasks.api';
import { colorSchema } from '@/consts';

// (getState() as RootState).auth.token

export function TaskCard({ task, openTask }: { task: TaskMultiple; openTask: CallableFunction }) {
   const useStateSelector = useSelector.withTypes<GlobalState>();
   // const count = useStateSelector((state) => state['api/tasks']);
   // const count = useStateSelector((state) => state.tasks.queries);

   const { data: { data: tagsInfo } = { data: null } } = useGetTaskTagsQuery(undefined);
   const { data: { data: prioritiesInfo } = { data: [] } } = useGetTaskPrioritiesQuery(undefined);
   const { data: { data: tasktypesInfo } = { data: [] } } = useGetTaskTypesQuery(undefined);

   const priorities = useMemo(
      () =>
         prioritiesInfo.reduce(
            (acc, cur) => ((acc[cur.id as number] = cur.name || ''), acc),
            {} as Record<number, string>
         ),
      [prioritiesInfo]
   );

   const priority = useMemo(() => prioritiesInfo?.find((v) => v.id === task.priority), [prioritiesInfo]);
   const tag = useMemo(() => tagsInfo?.find((v) => v.id === task.component), [tagsInfo]);
   const tasktype = useMemo(() => tasktypesInfo?.find((v) => v.id === task.task_type), [tasktypesInfo]);

   const [{ opacity }, dragRef] = useDrag(
      () => ({
         type: 'text',
         item: { id: task.id },
         collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.5 : 1,
         }),
      }),
      []
   );

   // const { attributes, listeners, setNodeRef, transform } = useDraggable({
   //    id: task.id || 'draggable',
   // });

   // const dragstyle = transform
   //    ? {
   //         transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
   //      }
   //    : undefined;

   return (
      //  ref={setNodeRef} {...listeners} {...attributes} style={dragstyle}
      <div className={style.card} ref={dragRef as unknown as LegacyRef<HTMLDivElement>} onClick={() => openTask()}>
         <div className={style.header}>
            <h5>id: {task.id}</h5>
            <div className={style.prioritize} style={colorSchema.priorities[(priority?.id || 0) - 1]}>
               • {priority?.name}
            </div>
         </div>
         <h3>
            {task.name}
            {/* {store.getState()['api/tasks'].queries} */}
            {/* {(store.getState() as RootState)} */}
         </h3>
         <h4>user {task.created_by}</h4>
         <div className={style.tags}>
            {tag ? <span style={{ backgroundColor: tag?.color }}>{tag?.name}</span> : ''}            
            <span style={colorSchema.taskTypes[(tasktype?.id || 0) - 1]}>{tasktype?.name}</span>
         </div>
      </div>
   );
}
