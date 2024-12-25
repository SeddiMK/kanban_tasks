import {  TaskType, Component, Stage, Priority, User } from '@/api/data.types';

export const typesTasksOptions: TaskType[] | undefined = [
   { id: 1, name: 'Баг' },
   { id: 2, name: 'Задача' },
   { id: 3, name: 'Улучшение' },
   { id: 4, name: 'Новая функциональность' },
   { id: 5, name: 'Эпик' },
   { id: 6, name: 'Релиз' },
   { id: 7, name: 'Бэклог' },
];

export const compOptions: Component[] | undefined = [
   { id: 1, name: 'Дизайн', color: '#EA5471' },
   { id: 2, name: 'Вёрстка', color: '#FFA826' },
   { id: 3, name: 'Разработка', color: '#3787EB' },
   { id: 4, name: 'Тестирование', color: '#18BACE' },
   { id: 5, name: 'Контент', color: '#FF5A4F' },
   { id: 6, name: 'Менеджмент', color: '#FF6E41' },
   { id: 7, name: 'Фронтенд', color: '#32C997' },
   { id: 8, name: 'Администрирование', color: '#4761EE' },
   { id: 9, name: 'Аналитика', color: '#4C33FF' },
   { id: 10, name: 'Копирайт', color: '#13B4ED' },
];

export const priorOptions: Priority[] | undefined = [
   { id: 1, name: 'Низкий' },
   { id: 2, name: 'Средний' },
   { id: 3, name: 'Высокий' },
];

export const usersOptions: User[] | undefined = [
   { id: 1, name: 'Иван', surname: 'Иванов', email: 'ivanov@mail.com' },
   { id: 2, name: 'Мария', surname: 'Петрова', email: 'petrova@mail.com' },
   { id: 3, name: 'Анна', surname: 'Сидорова', email: 'sidorova@mail.com' },
];

export const stagesOptions: Stage[] | undefined = [
   { id: 1, name: 'Разработка', color: '#3787eb' },
   { id: 2, name: 'Дизайн', color: '#ea5471' },
   { id: 3, name: 'Верстка', color: '#ffa826' },
   { id: 4, name: 'Тестирование', color: '#18bace' },
   { id: 5, name: 'Контент', color: '#ff5a4f' },
   { id: 6, name: 'Менеджмент', color: '#ff6e41' },
   { id: 7, name: 'Фронтенд', color: '#32c997' },
   { id: 7, name: 'Администрирование', color: '#4761ee' },
];
