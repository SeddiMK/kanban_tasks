import style from './aside-panel.module.css';
import Logo from '@public/Logo.svg';
import Collapse from '@public/icons/collapse-btn.svg';
import ProjectsIcon from '@public/icons/projects.svg';
import Link from 'next/link';
import { useReducer } from 'react';
import { projectsUrl } from '@/consts';
import { useGetCurrentUserQuery } from '@/api/user/user.api';
import { removeCookie } from '@/utils/cookies';
import { useRouter } from 'next/router';
import { inter } from '@/pages/_app';

export function AsidePanel() {
   //
   const [expanded, changeExpanded] = useReducer((v) => !v, true);

   const { data: { data: user } = { data: null }, isLoading, isError } = useGetCurrentUserQuery();
   const router = useRouter();

   const exit = () => {
      //
      removeCookie('token-auth');
      router.push('/');
   };

   return (
      <div className={[style.container, expanded ? '' : style.collapsed, inter.className].join(' ')}>
         <div className={style.title}>
            <Logo />
            <h3>DS KANBAN</h3>
         </div>

         <div className={style.user}>
            {/*  style={{ backgroundImage: '' }} */}
            <div
               className={style.ava}
               style={user?.avatar ? { backgroundImage: `url(${user?.avatar?.link})` } : {}}
            ></div>
            <div className="username">
               {isLoading ? (
                  <h3>loading...</h3>
               ) : (
                  <>
                     <h3>
                        {user?.name} {user?.surname}
                     </h3>
                     <h4>{user?.position}</h4>
                  </>
               )}
            </div>
         </div>
         <button className={style.exit} onClick={exit}>
            Выйти
         </button>

         <hr />

         {!expanded ? (
            <div className={style.projects_logo}>
               <ProjectsIcon />
            </div>
         ) : (
            <div className={style.projects}>
               <div className={style.projects_title}>
                  <ProjectsIcon />
                  <Link href={projectsUrl}>
                     <h3>Проекты</h3>
                  </Link>
               </div>
            </div>
         )}

         <div className={style.collapse_btn} title="Свернуть" onClick={changeExpanded} tabIndex={0}>
            <Collapse />
         </div>
      </div>
   );
}
