import { BASE_URL, projectsUrl } from '@/consts';
import FavLogo from '@public/icons/favorite-icon.svg';
import Link from 'next/link';
import { useState } from 'react';
import { ProjectItem, useUpdateProjectMutation } from '../../api/api';
import style from './project-card.module.scss';

type PropsType = {
   project?: ProjectItem;
   onChange?: (isFavorite: boolean) => void;
};

export function ProjectCard({ project, onChange }: PropsType) {
   //
   const [isFavorite, setFavorite] = useState(project?.is_favorite);

   const [updateProject, _result] = useUpdateProjectMutation({
      fixedCacheKey: 'shared-update-project',
   });

   /**
    *
    * @param e
    */
   const switchFavoriteState = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      updateProject({ id: project?.id as number, type: 'project', setFavorite: !project?.is_favorite });
   };

   return (
      <Link className={style.card} href={projectsUrl + '/' + project?.slug}>
         <div
            className={style.favorite_icon}
            style={project?.is_favorite ? { backgroundColor: `var(--main-blue)` } : {}}
            onClick={switchFavoriteState}
         >
            {!project?.is_favorite ? <FavLogo /> : ''}
         </div>
         <img src={project?.logo?.link ? BASE_URL + project?.logo?.link : '/media/ProjectLogo.svg'} alt="." />
         <h5>{project?.name || 'DS Внутренние проекты'}</h5>
         <div className={style.hint}>
            {project?.user_count ? `${project.user_count} сотрудников` : 'Сотрудников не найдено'}
         </div>
      </Link>
   );
}
