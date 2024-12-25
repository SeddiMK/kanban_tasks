import React, { useEffect, useRef, useState } from 'react';
import style from '@/components/select_custom_checkbox/SelectCustomCheckbox.module.scss';
import ArrowDown from '@public/icons/arrow-down-select.svg';
import Close from '@public/icons/close.svg';
import { User } from '@/api/data.types';

interface SelectCustomProps<T extends { id?: number, name?: string, surname?: string } = User> {
   value: T[];
   onChange: (newValue: T[]) => void; // Функция для обновления значений
   options: T[];
   label?: string;
   titleSelect?: string; // Заголовок, если ничего не выбрано
   required?: boolean;
   wrapClassName?: string
}

export default function SelectCustomCheckbox<T extends { id?: number, name?: string, surname?: string } = User>({
   value,
   onChange,
   options,
   label,
   titleSelect = 'Выберите значение',
   required = false,
   wrapClassName = '',
}: SelectCustomProps<T>) {
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   // Переключение состояния выбранности
   const toggleOption = (optionValue: T) => {
      if (value.some((item) => item.id === optionValue.id)) {
         onChange(value.filter((item) => item.id !== optionValue.id)); // Удалить значение
      } else {
         onChange([...value, optionValue]); // Добавить значение
      }
   };

   // Функция для удаления элемента
   const removeItem = (valueToRemove: User) => {
      onChange(value.filter((v) => v.id !== valueToRemove.id)); // Удаляем из массива выбранных значений
   };

   // Закрытие при клике вне компонента
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false); // Закрыть выпадающий список
         }
      };

      if (isOpen) {
         document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isOpen]);

   return (
      <div className={[style['select-custom'], wrapClassName].join(' ')} ref={dropdownRef} tabIndex={0}>
         {/* Заголовок */}
         {label && (
            <label className={style['label']}>
               {label} {required && <span className={style['required']}>*</span>}
            </label>
         )}

         {/* Выпадающий заголовок */}
         <div
            className={`${style['dropdown']} ${isOpen ? style['open'] : ''}`}
            onClick={() => setIsOpen((prev) => !prev)}
         >
            <div className={style['dropdown-header-wrp']}>
               <div className={style['dropdown-header']}>
                  {value?.length > 0
                     ? value?.map((user) => (
                          <span className={style['dropdown-item-header']} key={user.id}>
                             {user.name} {user.surname}
                             {/* Крестик для удаления */}
                             <span
                                className={style['close-wrp']}
                                onClick={(e) => {
                                   e.stopPropagation();
                                   removeItem(user);
                                }}
                             >
                                <Close />
                             </span>
                          </span>
                       ))
                     : titleSelect}
               </div>
            </div>

            <span className={`${style['dropdown-arrow']} ${isOpen ? style['open'] : ''}`}>
               <ArrowDown />
            </span>
         </div>

         {/* Список опций */}
         {isOpen && (
            <ul className={style['dropdown-list']}>
               {options.map((user) => (
                  <li key={user.id} className={style['dropdown-item']}>
                     <label className={style['checkbox-label']}>
                        <input
                           type="checkbox"
                           checked={value?.some((v) => v.id === user.id)}
                           onChange={() => toggleOption(user)}
                           className={style['checkbox-input']}
                        />
                        <span className={style['checkbox-custom']}></span>
                        {user.name} {user.surname}
                     </label>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
