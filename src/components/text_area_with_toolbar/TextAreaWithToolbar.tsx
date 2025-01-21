import React, { useEffect, useRef, useState } from 'react';
import style from '@/components/text_area_with_toolbar/text-area-with-toolbar.module.scss';
import BoldText from '@public/icons/bold-text.svg';
import Italic from '@public/icons/italic.svg';
import InlineCode from '@public/icons/inline-code.svg';
import ListBulleted from '@public/icons/list-bulleted.svg';
import ListNumbered from '@public/icons/list-numbered.svg';

interface TextAreaWithToolbarProps {
   value: string | undefined;
   onChange: (value: string) => void;
   error?: string;
}

type ActiveStyles = {
   fontWeight: 'normal' | 'bold';
   fontStyle: 'normal' | 'italic';
   fontFamily: 'inherit' | 'monospace';
};

export default function TextAreaWithToolbar({ value, onChange, error }: TextAreaWithToolbarProps) {
   const [text, setText] = useState<string>('');
   const [newText, setNewText] = useState<string>('');
   const [activeButton, setActiveButton] = useState<string | null>(null);
   const [numSelectionStart, setNumSelectionStart] = useState(0);
   const [numSelectionEnd, setNumSelectionEnd] = useState(0);
   const [numSelectionValue, setNumSelectionValue] = useState('');
   const [currentListMode, setCurrentListMode] = useState<'bullet' | 'numbered' | 'none'>('none');

   const [activeStyles, setActiveStyles] = useState<ActiveStyles>({
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontFamily: 'inherit',
   });
   const textAreaRef = useRef<HTMLTextAreaElement>(null);

   // Функция для применения и отмены стилей
   const applyStyleBtn = (style: string) => {
      const textarea = textAreaRef.current;
      if (activeButton === style) {
         setActiveButton(null);
      } else {
         setActiveButton(style);
      }
      if (textarea) textarea.focus();
   };

   // Функция для установки режима списка
   const applyListFormat = (format: 'bullet' | 'numbered' | 'none') => {
      applyStyleBtn(format);
      const textarea = textAreaRef.current;

      if (!textarea) return;

      if (format === 'bullet') {
         setCurrentListMode('bullet');
      } else if (format === 'numbered') {
         setCurrentListMode('numbered');
      } else {
         setCurrentListMode('none');
      }

      textarea.focus();
   };

   // Обработка ввода текста
   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = textAreaRef.current;
      if (!textarea) return;

      const { value, selectionStart } = textarea;

      if (e.key === 'Enter') {
         e.preventDefault();

         const lastNewlineIndex = value.lastIndexOf('\n', selectionStart - 1);
         const currentLine = value.substring(lastNewlineIndex + 1, selectionStart);

         let newLinePrefix = '';

         // Добавляем префикс в зависимости от текущего режима
         if (currentListMode === 'bullet') {
            newLinePrefix = '• ';
         } else if (currentListMode === 'numbered') {
            const match = currentLine.match(/^(\d+)\.\s/);
            if (match) {
               const currentNumber = parseInt(match[1], 10);
               newLinePrefix = `${currentNumber + 1}. `;
            } else {
               newLinePrefix = '1. ';
            }
         }

         const before = value.substring(0, selectionStart);
         const after = value.substring(selectionStart);
         const updatedValue = `${before}\n${newLinePrefix}${after}`;

         setText(updatedValue);

         // Устанавливаем новый курсор после обновления текста
         const newCursorPos = selectionStart + newLinePrefix.length + 1;
         requestAnimationFrame(() => {
            textarea.setSelectionRange(newCursorPos, newCursorPos);
         });
      }
   };

   // Функция применения активных стилей
   const applyStyle = (style: keyof ActiveStyles) => {
      applyStyleBtn(style);

      const textarea = textAreaRef.current;
      if (!textarea) return;

      const { value, selectionStart, selectionEnd } = textarea;

      if (value.length > 0) {
         setNumSelectionEnd(selectionEnd);
         setNumSelectionStart(selectionStart);
         setNumSelectionValue(value);
      }

      setActiveStyles((prev) => ({
         ...prev,
         [style]:
            style === 'fontWeight'
               ? prev.fontWeight === 'bold'
                  ? 'normal'
                  : 'bold'
               : style === 'fontStyle'
                 ? prev.fontStyle === 'italic'
                    ? 'normal'
                    : 'italic'
                 : prev.fontFamily === 'monospace'
                   ? 'inherit'
                   : 'monospace',
      }));

      if (textarea) textarea.focus();
   };

   const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = textAreaRef.current;
      if (!textarea) return;

      const { value, selectionStart, selectionEnd } = textarea;

      if (numSelectionValue) {
         // Получаем текст до курсора
         const before = numSelectionValue.substring(0, numSelectionStart);

         // Получаем текст после курсора
         const after = numSelectionValue.substring(numSelectionEnd);

         // Новый ввод текста
         const newTextInput = e.target.value.slice(numSelectionStart);

         // Применяем стили, например, добавляем жирный текст (Markdown синтаксис)
         //  const styledText = applyStylesToText(newTextInput);

         // Формируем итоговый текст с новым введённым текстом
         const finalText = before + newTextInput + after;

         // Обновляем состояние (и передаем в родительский компонент, если нужно)
         //  setNewText(styledText);
         //  onChange(finalText);

         // Обновляем состояние текста
         setText(newText);
         //  onChange(newText);

         // Сохраняем курсор после ввода
         textarea.setSelectionRange(numSelectionStart + newTextInput.length, numSelectionStart + newTextInput.length);
      } else {
         onChange(value);
      }

      // onChange(e.target.value);
      setText(e.target.value);
   };

   useEffect(() => {
      if (text) onChange(text);
   }, [text]);

   return (
      <div className={style['textarea-wrp']}>
         {/* Панель инструментов */}
         <div className={style['textarea-header']}>
            {/* Кнопка жирного текста */}
            <button
               className={`${style['btn-textarea-icon']} ${activeButton === 'fontWeight' ? style['btn-textarea-active'] : ''}`}
               type="button"
               onClick={() => applyStyle('fontWeight')}
            >
               <BoldText />
            </button>

            {/* Кнопка курсива */}
            <button
               className={`${style['btn-textarea-icon']} ${activeButton === 'fontStyle' ? style['btn-textarea-active'] : ''}`}
               type="button"
               onClick={() => applyStyle('fontStyle')}
            >
               <Italic />
            </button>

            {/* Кнопка кода */}
            <button
               className={`${style['btn-textarea-icon']} ${activeButton === 'fontFamily' ? style['btn-textarea-active'] : ''}`}
               type="button"
               onClick={() => applyStyle('fontFamily')}
            >
               <InlineCode />
            </button>

            {/* Кнопка маркированного списка */}
            <button
               className={`${style['btn-textarea-icon']} ${activeButton === 'bullet' ? style['btn-textarea-active'] : ''}`}
               type="button"
               onClick={() => applyListFormat(currentListMode === 'bullet' ? 'none' : 'bullet')}
            >
               <ListBulleted />
            </button>

            {/* Кнопка нумерованного списка */}
            <button
               className={`${style['btn-textarea-icon']} ${activeButton === 'numbered' ? style['btn-textarea-active'] : ''}`}
               type="button"
               onClick={() => applyListFormat(currentListMode === 'numbered' ? 'none' : 'numbered')}
            >
               <ListNumbered />
            </button>
         </div>
         <div></div>

         <textarea
            ref={textAreaRef}
            className={style.textarea}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            style={{
               fontWeight: activeStyles.fontWeight || 'normal',
               fontStyle: activeStyles.fontStyle || 'normal',
               fontFamily: activeStyles.fontFamily || 'inherit',
            }}
         />
      </div>
   );
}
