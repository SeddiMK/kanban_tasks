import { BreadCrumbs } from '@components/bread_crumbs/BreadCrumbs';
import { AsidePanel } from '@components/left_menu/AsidePanel';
import styles from './task-page.module.scss';
import { useGetCurrentUserQuery, useGetTaskByTaskIdQuery } from '@/api/appApi';
import { useRouter } from 'next/router';
import TaskContent from './components/TaskContent/TaskContent';
import { useEffect } from 'react';
import { projectsUrl } from '@/consts';

export default function TaskPage() {
   const router = useRouter();
   const taskId = Number(router.query['task-slug']);
   const projectSlug = router.query['project-slug'] as string;
   const { data, isLoading, isError, refetch: taskRefetch } = useGetTaskByTaskIdQuery(taskId);
   const { data: user } = useGetCurrentUserQuery();

   useEffect(() => {
      if (isError) {
         router.replace('/404');
      }
   }, [isError]);

   useEffect(() => {
      if (data?.data.project?.slug !== projectSlug && data?.data.project?.slug) {
         router.replace('/404');
      }
   }, [data?.data.project?.slug]);

   return (
      <div className={styles.layout_page}>
         {isLoading ? (
            <div className="loader" style={{ margin: '36% auto' }}></div>
         ) : (
            <>
               <AsidePanel />
               <div className={styles.layout_content}>
                  <BreadCrumbs
                     crumbs={[
                        { text: 'Главная', url: '/' },
                        { text: 'Проекты', url: projectsUrl },
                        { text: projectSlug, url: `${projectsUrl}/${projectSlug}` },
                        {
                           text: `Задачa id: ${taskId}`,
                           url: `${projectsUrl}/${projectSlug}/${taskId}`,
                        },
                     ]}
                  />
                  <div className={styles.page_container}>
                     <TaskContent
                        task={data?.data}
                        activeUser={user?.data}
                        projectSlug={projectSlug}
                        taskRefetch={taskRefetch}
                     />
                  </div>
               </div>
            </>
         )}
      </div>
   );
}
