import React, { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import style from '@/components/calendar_custom/calendar-custom.module.scss';
import CalendarIcon from '@public/icons/calendar.svg';

interface CalendarCustomProps {
   value?: { startDate?: string; endDate?: string };
   onChange: (dates: { startDate: string | null; endDate: string | null }) => void;
}

type TileDisabledParams = {
   date: Date;
};

export default function CalendarCustom({ value, onChange }: CalendarCustomProps) {
   const [startDate, setStartDate] = useState<Date | null>(value?.startDate ? new Date(value.startDate) : null);
   const [endDate, setEndDate] = useState<Date | null>(value?.endDate ? new Date(value.endDate) : null);
   const [showStartCalendar, setShowStartCalendar] = useState<boolean>(false); // Состояние для показа календаря начала
   const [showEndCalendar, setShowEndCalendar] = useState<boolean>(false); // Состояние для показа календаря завершения
   const calendarRef = useRef<HTMLDivElement | null>(null);

   // Обработчик выбора даты (для начала и завершения)
   const handleDateClick = (date: Date) => {
      if (showStartCalendar) {
         setStartDate(date);
         onChange({ startDate: date.toISOString(), endDate: endDate ? endDate.toISOString() : null });
         setShowStartCalendar(false);
      } else if (showEndCalendar) {
         setEndDate(date);
         onChange({ startDate: startDate ? startDate.toISOString() : null, endDate: date.toISOString() });
         setShowEndCalendar(false);
      }
   };

   // Добавление классов для ячеек
   const tileClassName = ({ date }: TileDisabledParams) => {
      const startDateObj = startDate ? new Date(startDate) : null;
      const endDateObj = endDate ? new Date(endDate) : null;

      if (startDateObj && date < startDateObj) return style.disabledDate;
      if (startDateObj && date.toDateString() === startDateObj.toDateString()) return style.startDate;
      if (startDateObj && endDateObj && date > startDateObj && date < endDateObj) return style.range;
      if (endDateObj && date.toDateString() === endDateObj.toDateString()) return style.endDate;
      return '';
   };

   // Отключение выбора недопустимых дат
   const tileDisabled = ({ date }: TileDisabledParams) => {
      const today = new Date();

      if (date < today) return true;

      if (showStartCalendar && endDate && date > endDate) return true;

      if (showEndCalendar && startDate && date < new Date(startDate)) return true;

      return false;
   };

   // Переключение календарей
   const handleStartDateClick = () => {
      if (!showStartCalendar && !showEndCalendar) {
         setShowStartCalendar(true);
         setShowEndCalendar(false);
         return;
      }
   };

   const handleEndDateClick = () => {
      if (!showStartCalendar && !showEndCalendar) {
         setShowStartCalendar(false);
         setShowEndCalendar(true);
         return;
      }
   };

   // Обработчик клика вне области календаря
   const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Игнорируем клики по кнопкам навигации календаря (следующие и предыдущие стрелки)
      if (
         target.classList.contains('react-calendar__navigation__arrow') ||
         target.closest('.react-calendar__navigation') // если клик на родительский элемент навигации
      ) {
         return;
      }

      // Закрываем календарь, если клик был вне календаря
      if (calendarRef.current && !calendarRef.current.contains(target)) {
         setShowStartCalendar(false);
         setShowEndCalendar(false);
      }
   };

   // Синхронизация состояния с пропсами `value`
   useEffect(() => {
      if (value) {
         setStartDate(value.startDate ? new Date(value.startDate) : null);
         setEndDate(value.endDate ? new Date(value.endDate) : null);
      }
   }, [value]);

   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);

   return (
      <div className={style['date-range-picker']}>
         <div className={style['inputs-date']}>
            {/* Дата начала */}
            <div className={style['input-wrp']} onClick={handleStartDateClick}>
               <label>Дата начала</label>
               <div className={style['inp']}>
                  <input
                     type="text"
                     value={startDate ? startDate.toLocaleDateString() : ''}
                     placeholder="Дата начала"
                     readOnly
                  />
                  <span className={style['calendar-icon']}>
                     <CalendarIcon />
                  </span>

                  {showStartCalendar && (
                     <div className="calendar-wrapper" ref={calendarRef}>
                        <Calendar
                           locale="ru"
                           className="custom-calendar"
                           value={startDate || new Date()}
                           onClickDay={handleDateClick}
                           formatMonthYear={(locale, date) =>
                              `${date.toLocaleString(locale, { month: 'long' })} ${date.getFullYear()}`
                           }
                           tileClassName={tileClassName}
                           tileDisabled={tileDisabled}
                        />
                     </div>
                  )}
               </div>
            </div>

            {/* Дата завершения */}
            <div className={style['input-wrp']} onClick={handleEndDateClick}>
               <label>Дата завершения</label>
               <div className={style['inp']}>
                  <input
                     type="text"
                     value={endDate ? endDate.toLocaleDateString() : ''}
                     placeholder="Дата завершения"
                     readOnly
                  />
                  <span className={style['calendar-icon']}>
                     <CalendarIcon />
                  </span>

                  {showEndCalendar && (
                     <div className="calendar-wrapper" ref={calendarRef}>
                        <Calendar
                           locale="ru"
                           className="custom-calendar"
                           value={endDate || new Date()}
                           onClickDay={handleDateClick}
                           formatMonthYear={(locale, date) =>
                              `${date.toLocaleString(locale, { month: 'long' })} ${date.getFullYear()}`
                           }
                           tileClassName={tileClassName}
                           tileDisabled={tileDisabled}
                        />
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
