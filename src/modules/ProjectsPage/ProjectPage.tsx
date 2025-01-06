'use client';

import { useMemo, useReducer, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { projectsUrl } from '@/consts';
import { useResize } from '@/hooks/resize';
import { BreadCrumbs } from '@components/bread_crumbs/BreadCrumbs';
import { useGetProjectsQuery } from './api/api';
import { ProjectCard } from './components/project_card/ProjectCard';
import { projectsFilterFormSchema } from './utils/validationSchema';

import style from './projects-page.module.scss';
import { TaskSingle } from '../../api/data.types';
import { useLazyGetTaskQuery } from '@/api/tasks/tasks.api';
import Link from 'next/link';

type FormSchema = z.infer<typeof projectsFilterFormSchema>;

export function ProjectPage() {
   const { width } = useResize();

   const { data: { data: projects } = { data: [] }, isLoading, isSuccess, isError, error } = useGetProjectsQuery();
   const [getTask, _droppedTasks] = useLazyGetTaskQuery();

   const [foundTask, setFoundTask] = useState<TaskSingle | null | undefined>(null);

   const [filterData, setFilterData] = useState<Record<keyof FormSchema, string>>({ projectName: '', taskId: '' });
   const viewedProjects = useMemo(
      () => projects.filter((p) => p.name && ~p.name.toLowerCase().indexOf(filterData.projectName.toLowerCase())),
      [projects, filterData]
   );

   const [justArchive, switchArchiveProjects] = useReducer((v) => !v, false);

   const {
      register,
      handleSubmit,
      // clearErrors,
      // reset,
      formState: { isDirty, isSubmitting, errors },
   } = useForm<FormSchema>({
      mode: 'all',
      resolver: zodResolver(projectsFilterFormSchema),
      defaultValues: {
         projectName: '',
      },
   });

   useMemo(() => {
      const columnsCount = Math.floor((width - 272) / 264); // 208 - on `5/1168`
      globalThis.document?.documentElement.style.setProperty('--columns-count', columnsCount.toString());
   }, [width]);

   const onSubmit: SubmitHandler<FormSchema> = (data) => {
      //
      if ((data.projectName?.length || 0) >= 3) {
         setFilterData(data as typeof filterData);
      } else if (data.projectName?.length === 0) {
         setFilterData(data as typeof filterData);
      }
   };

   return (
      <>
         <BreadCrumbs
            crumbs={[
               { text: 'Главная', url: '/' },
               { text: 'Проекты', url: projectsUrl },
            ]}
         />

         <br />

         <h1>Проекты</h1>

         <form className={style.filters} onSubmit={handleSubmit(onSubmit)}>
            <div data-error={errors.projectName?.message}>
               <label htmlFor="projectName" className="label">
                  Название проекта
               </label>
               <input
                  onInput={(e) => onSubmit({ projectName: (e.target as HTMLInputElement).value })}
                  style={{ backgroundColor: errors.projectName ? '#FFF1F0' : undefined }}
                  type="text"
                  id="projectName"
                  placeholder="Введите название проекта"
                  {...register('projectName')}
               />
            </div>
            <div data-error={errors.taskId?.message}>
               <label htmlFor="taskId" className="label">
                  Номер задачи
               </label>
               <input
                  tabIndex={0}
                  autoComplete={'one-time-code'}
                  style={{ backgroundColor: errors.taskId ? '#FFF1F0' : undefined }}
                  type="text"
                  id="taskId"
                  placeholder="Введите номер задачи"
                  onInput={(e) => {
                     const id = (e.target as HTMLInputElement).value;
                     if (!id) {
                        setFoundTask(null);
                        return;
                     }
                     if (Number.parseInt(id) > 0) {
                        getTask(id.trim()).then(({ data: taskInfo }) => {
                           const { data: task } = taskInfo || {};
                           setFoundTask(task);
                        });
                     } else {
                        setFoundTask(null);
                     }
                  }}
                  {...register('taskId', {
                     // onBlur: (e) => setFoundTask(null),
                     setValueAs: (v: string) => (v.length ? +v : ''),
                     required: false,
                     // valueAsNumber: true,
                  })}
               />

               {foundTask !== null ? (
                  <div className={style.found_task}>
                     {foundTask ? (
                        <Link tabIndex={0} href={`${projectsUrl}/${foundTask.project?.slug}/${foundTask.id}`}>
                           {foundTask.name}
                        </Link>
                     ) : (
                        <span style={{ color: 'gray' }}>Задача не найдена</span>
                     )}
                  </div>
               ) : (
                  <></>
               )}
            </div>
            <button type="submit" style={{ display: 'none' }}></button>
         </form>
         <div className={style.archive_checkbox}>
            <input type="checkbox" name="" id="" onChange={switchArchiveProjects} />
            <span>Показать архивные проекты</span>
         </div>

         {justArchive ? (
            <div className={style.projects} style={{ marginTop: '40px' }}>
               {viewedProjects
                  .filter((proj) => proj.is_archived)
                  .map((proj) => {
                     return (
                        <ProjectCard
                           key={proj.id}
                           project={proj}
                           onChange={(isFavorite) => {
                              proj.is_favorite = isFavorite;
                           }}
                        />
                     );
                  })}
            </div>
         ) : (
            <>
               {projects.some((proj) => proj.is_favorite && !proj.is_archived) ? (
                  <>
                     <h4 style={{ margin: '3rem 0 2rem' }}>Избранные проекты</h4>

                     <div className={style.favorite_projects}>
                        {viewedProjects
                           .filter((proj) => proj.is_favorite && !proj.is_archived)
                           .map((proj) => {
                              return <ProjectCard key={proj.id} project={proj} />;
                           })}
                     </div>

                     <hr />
                  </>
               ) : (
                  <div style={{ marginTop: '40px' }}></div>
               )}

               <div className={style.projects}>
                  {viewedProjects
                     .filter((proj) => !proj.is_favorite && !proj.is_archived)
                     .map((proj) => {
                        return <ProjectCard key={proj.id} project={proj} />;
                     })}
               </div>
            </>
         )}
      </>
   );
}
