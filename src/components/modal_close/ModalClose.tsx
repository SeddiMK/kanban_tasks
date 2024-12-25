import React, { useEffect } from 'react';
import Close from '@public/icons/close.svg';
import styles from '@/components/modal_close/modal-close.module.scss';

type ModalProps = {
   title: string;
   isOpen: boolean;
   onClose?: () => void;
   onConfirm?: () => void;
};

export default function ModalClose({ title, isOpen, onClose, onConfirm }: ModalProps) {
   // Закрытие модального окна при клике вне его области
   const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains(styles.overlay) && onConfirm) {
         onConfirm();
      }
   };

   // Подключение обработчика событий
   useEffect(() => {
      if (isOpen) {
         document.addEventListener('mousedown', handleOutsideClick);
      } else {
         document.removeEventListener('mousedown', handleOutsideClick);
      }

      return () => {
         document.removeEventListener('mousedown', handleOutsideClick);
      };
   }, [isOpen]);

   if (!isOpen) return null;

   return (
      <div className={styles.overlay}>
         <div className={styles.modal}>
            <div className={styles.header}>
               <h2 className={styles.title}>{title}</h2>
               <button className={styles['close-button']} type="button" onClick={onConfirm}>
                  <Close />
               </button>
            </div>

            <div className={styles.footer}>
               <button className={styles.button} type="button" onClick={onClose}>
                  Да
               </button>
               <button className={styles.button} type="button" onClick={onConfirm}>
                  Нет
               </button>
            </div>
         </div>
      </div>
   );
}
