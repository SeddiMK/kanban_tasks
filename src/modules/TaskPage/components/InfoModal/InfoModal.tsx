import styles from './info.module.scss';
import { MouseEvent, useEffect, useState } from 'react';
import Check from '@public/icons/check.svg';
import Error from '@public/icons/error.svg';

export default function InfoModal({
   title,
   info,
   setClose,
   type,
}: {
   title: string;
   info: string;
   setClose: CallableFunction;
   type: 'info' | 'error';
}) {
   const [closeAnimation, setCloseAmimation] = useState<string>('');
   const backCloseHandler = (e: MouseEvent<HTMLDivElement>) => {
      if (e.target instanceof HTMLDivElement) {
         if (e.target.className !== styles.modal) {
            setCloseAmimation('slide_in_left');
            setClose(false);
         }
      }
   };

   useEffect(() => {
      setTimeout(() => {
         setCloseAmimation('slide_in_left');
         setTimeout(() => setClose(false), 1000);
      }, 4000);
   }, []);

   return (
      <div onClick={(e) => backCloseHandler(e)}>
         <div
            className={`${styles.modal} ${styles[closeAnimation]}`}
            onClick={() => setCloseAmimation('slide_in_left')}
         >
            <div className={styles.box}>
               <div className={styles.box}>{type === 'error' ? <Error /> : <Check />}</div>
               <div>
                  <h4 className={styles.title}>{title}</h4>
                  <p className={styles.info}>{info}</p>
               </div>
            </div>
            <div className={styles.container}>
               <div className={`${styles.progress} ${styles.progress_striped}`}>
                  <div
                     className={styles.progress_bar}
                     style={{ backgroundColor: type === 'error' ? '#c33025' : '#009262' }}
                  ></div>
               </div>
            </div>
         </div>
      </div>
   );
}
