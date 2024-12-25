import React, { useState, useEffect, useRef } from 'react';
import style from '@/components/select_custom/select-custom.module.scss';
import ArrowDown from '@public/icons/arrow-down-select.svg';
import { Component, Priority, Stage, TaskType } from '@/api/data.types';

type SelectCustomProps<T> = {
   value: T | undefined;
   onChange: (value: T | undefined) => void;
   options: T[] | undefined;
   titleSelect: string;
   label?: string;
   required?: boolean;
   errors?: string;
   isLoading?: boolean;
   fetchError?: string;
   maxWidth?: number | string;
   optionRenderer?: (option: TaskType | Stage | Priority | Component | undefined) => React.ReactNode; // Позволяет кастомизировать отображение опций
};

export default function SelectCustom<T>({
   value,
   onChange,
   options,
   titleSelect,
   label,
   required,
   errors,
   isLoading,
   fetchError,
   optionRenderer,
   maxWidth,
}: SelectCustomProps<T>) {
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   const valueWithType = value as TaskType | Stage | Priority | Component | undefined;

   const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
         setIsOpen(false);
      }
   };

   // Закрытие при клике вне компонента
   useEffect(() => {
      if (isOpen) {
         document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isOpen]);

   return (
      <div className={style['select-custom']} ref={dropdownRef} style={{ maxWidth: maxWidth }}>
         {label && (
            <label className={style.label} htmlFor="select-custom">
               {label} {required && <span>*</span>}
            </label>
         )}
         {isLoading ? (
            <p>Загрузка...</p>
         ) : fetchError ? (
            <p className={style.error}>{fetchError}</p>
         ) : (
            <div className={style['select-wrp']}>
               <div
                  className={`${style['select']} ${isOpen ? style['open'] : ''}`}
                  onClick={() => setIsOpen((prev) => !prev)}
               >
                  <span className={`${style['select-title']} ${valueWithType?.name ? style.selected : ''}`}>
                     {valueWithType?.name
                        ? optionRenderer
                           ? optionRenderer(valueWithType)
                           : String(valueWithType.name)
                        : titleSelect}
                  </span>
               </div>

               {isOpen && options && (
                  <ul className={style['dropdown-list']}>
                     {options.map((option, index) => {
                        const itemOfOptions = option as TaskType | Stage | Priority | Component;
                        const stageOption = option as Stage;
                        return (
                           <li
                              className={style['dropdown-item']}
                              key={index}
                              onClick={() => {
                                 onChange(option);
                                 setIsOpen(false);
                              }}
                           >
                              <span style={{ backgroundColor: stageOption.color ? stageOption.color : '' }}>
                                 {optionRenderer ? optionRenderer(itemOfOptions) : itemOfOptions.name}
                              </span>
                           </li>
                        );
                     })}
                  </ul>
               )}
               <span className={`${style['dropdown-arrow']} ${isOpen ? style['open'] : ''}`}>
                  <ArrowDown />
               </span>
            </div>
         )}
      </div>
   );
}
