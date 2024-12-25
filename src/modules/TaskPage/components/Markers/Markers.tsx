import styles from './markers.module.scss';
import { Priority, Component, TaskType } from '@/api/data.types';

export default function MarkersTask({
   priority,
   component,
   type,
}: {
   priority: Priority | undefined;
   component: Component | undefined;
   type: TaskType | undefined;
}) {
   return (
      <>
         <div>
            <p className={styles.tasktext}>Приоритет</p>
            <p className={`${styles.tabtext} ${styles[`priorety${priority?.id}`]}`}>{priority?.name}</p>
         </div>
         <div>
            <p className={styles.tasktext}>Компонент</p>
            <p className={styles.tabtext} style={{ backgroundColor: component?.color }}>
               {component?.name}
            </p>
         </div>
         <div>
            <p className={styles.tasktext}>Тип</p>
            <p className={`${styles.tabtext} ${styles[`type${type?.id}`]}`}>{type?.name}</p>
         </div>
      </>
   );
}
