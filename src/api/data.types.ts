/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { release } from 'os';
import { boolean, string, number } from 'zod';

/** Может принимать любое значение */
export type AnyValue = string | number | boolean | [] | object;

/** Пользователь */
export interface User {
   /** Идентификатор пользователя */
   id?: number;
   /** Активность */
   is_active?: boolean;
   /** Является ли пользователь администратором */
   is_admin?: boolean;
   /** Может ли грейдировать сотрудников */
   can_grade?: boolean;
   /** Имя пользователя */
   name?: string;
   /** Фамилия пользователя */
   surname?: string;
   /** Отчество пользователя */
   patronymic?: string | null;
   /** Email пользователя */
   email?: string;
   /** Файл */
   avatar?: ResponseFile;
   /** Пол пользователя */
   gender?: Gender;
   /** Теги пользователя */
   tags?: Tag[];
   /** Проекты пользователя. Отсутствует в запросах на получение нескольких пользователей */
   projects?: ProjectSingle[] | null;
   /** Дата создания */
   created_at?: string;
   /** Дата обновления */
   updated_at?: string;
}

/** Проект, одиночная выборка */
export interface ProjectSingle {
   /** Идентификатор проекта */
   id?: number;
   /** Название проекта */
   name?: string;
   /** Ссылка на вики проекта */
   wiki_link?: string;
   /** Символьный идентификатор проекта */
   slug?: string;
   /** Считается ли менеджер админом в проекте */
   perm_manager_is_admin?: boolean;
   /** Могут ли исполнители сами создавать задачи */
   perm_user_create_task?: boolean;
   /** Могут ли пользователи назначать задачи на себя */
   perm_user_self_assign?: boolean;
   /** Доступные действия текущего пользователя на проекте */
   capabilities?: ('create_tasks' | 'edit_project' | 'edit_project_perms' | 'reorder_tasks')[];
   /** Флоу используемый в проекте */
   flow?: Flow;
   /** Файл */
   logo?: ResponseFile;
   /** Роль пользователя на проекте. Присутствует только в контексте запроса информации о пользователе */
   role?: UserProjectRole;
   /** Дата создания */
   created_at?: string;
   /** Дата обновления */
   updated_at?: string;
   /** Дата начала работ */
   begin?: string;
   /** Дата окончания работ */
   end?: string;
   /** Расчётная дата окончания работ */
   estimated_end?: string;
   /** Запланированность проекта */
   project_planning?: {
      /** Сметное время */
      estimated?: number;
      /** Запланированное время */
      planned?: number;
      /** Процент запланированности */
      planned_percent?: number;
   } | null;
   project_cost?: {
      /** Суммарные значения */
      summary?: {
         /** Запланированное время */
         estimated_h?: number;
         /** Фактическое время */
         fact_h?: number;
         /** Сметная стоимость */
         estimated_total?: number;
         /** Фактическая стоимость */
         fact_total?: number;
         /** Прибыль */
         profit?: number;
         /** Рентабельность */
         profitability?: number;
      };
      items?: ({
         /** Роль пользователя на проекте. Присутствует только в контексте запроса информации о пользователе */
         role?: UserProjectRole;
         /** Запланированное время */
         estimated_h?: number;
         /** Фактическое время */
         fact_h?: number;
         /** Ставка */
         rate?: number;
         /** Сметная стоимость */
         estimated_total?: number;
         /** Фактическая стоимость */
         fact_total?: number;
         /** Отклонение */
         deviation?: number;
         /** Это овертайм */
         is_overtime?: boolean;
         /** Это гарантия */
         is_warranty?: boolean;
      } | null)[];
   };
   /** Готовность проекта */
   project_completion?: {
      /** Сметное время */
      estimated?: number;
      /** Плановое время завершённых задач */
      completed?: number;
      /** Процент готовности */
      completed_percent?: number;
   } | null;
}

/** Проект, множественная выборка */
export interface ProjectMultiple {
   /** Идентификатор проекта */
   id?: number;
   /** Название проекта */
   name?: string;
   /** Символьный идентификатор проекта */
   slug?: string;
   /** Файл */
   logo?: ResponseFile;
   /** Роль пользователя на проекте. Присутствует только в контексте запроса информации о пользователе */
   role?: UserProjectRole;
   /** Дата создания */
   created_at?: string;
   /** Дата обновления */
   updated_at?: string;
   /** Количество пользователей не проекте */
   user_count?: number | null;
   /** Тип проекта */
   project_type?: ProjectType;
   /** Дата начала работ */
   begin?: string;
   /** Дата окончания работ */
   end?: string;
}

/** Проект, краткий формат */
export interface ProjectShort {
   /** Идентификатор проекта */
   id?: number;
   /** Название проекта */
   name?: string;
   /** Символьный идентификатор проекта */
   slug?: string;
   /** Файл */
   logo?: ResponseFile;
}

/** Флоу используемый в проекте */
export interface Flow {
   /** Название флоу */
   name?: string;
   /** Символьный идентификатор флоу */
   slug?: string;
   /** Видимые пользователем поля задачи. Зависит от контекста запроса и роли текущего пользователя. */
   visibleTaskFields?: string[];
   /** Доступные в проекте компоненты задач */
   possibleProjectComponents?: Component[];
   /** Доступные в проекте стадии (колонки) */
   possibleProjectStages?: Stage[];
}

export type FlowList = Flow[];

/** Градация в задаче */
export interface GradeTaskItem {
   /** Идентификатор записи */
   id?: number;
   /** Оценка */
   rating?: number | null;
   /** оценен ли пункт */
   been_rated?: boolean;
   /** Пользователь */
   creator?: User;
   /** Пользователь */
   rater?: User;
   /** Пользователь */
   graded_user?: User;
   grade_item?: GradeItemEntity;
   /** Комментарий */
   comment?: string;
   grade_direction?: GradeDirectionEntity;
   grade?: GradeEntity;
}

/** Градация в задаче */
export interface TaskGradeUser {
   /** Идентификатор записи */
   id?: number;
   /** Обязательно к валидации */
   required?: boolean;
   /** Пользователь */
   user?: User;
}

/** Задача, одиночная выборка */
export interface TaskSingle {
   /** Идентификатор задачи */
   id?: number;
   /** Заголовок задачи */
   name?: string;
   /** Date Start task */
   date_start: string | null;
   /** Описание задачи */
   description?: string;
   /** Компонент задачи */
   component?: Component;
   /** Приоритет задачи */
   priority?: Priority;
   /** Стадия (колонка) задачи */
   stage?: Stage;
   /** Тип задачи */
   task_type?: TaskType;
   /** UsersList */
   users?: User[];
   /** Проект, одиночная выборка */
   project?: ProjectSingle;
   /** Возможности пользователях в рамках этой задачи */
   capabilities?: (
      | 'edit_task'
      | 'track_time'
      | 'remove_task'
      | 'add_comments'
      | 'assign_workers'
      | 'assign_workers_self'
      | 'link_tasks'
      | 'link_task_release'
      | 'attach_file'
   )[];
   /**
    * Может ли текущий пользователь добавить файл к задаче
    * @deprecated
    */
   can_attach_file?: boolean;
   /**
    * Может ли текущий пользователь оставлять комментарии к задаче
    * @deprecated
    */
   can_comment?: boolean;
   /** Ссылка на макет */
   layout_link?: string | null;
   /** Ссылка на вёрстку */
   markup_link?: string | null;
   /** Ссылка на сборку */
   dev_link?: string | null;
   /** Стадий, на которые можно перевести эту задачу */
   possibleTaskNextStages?: Stage[];
   /** files */
   files?: ResponseFile[] | undefined;
   /** Задачи, заблокированные этой задачей */
   block?: TaskSingle[] | null;
   /** Эпик, к которому привязана эта задача */
   epic?: TaskSingle | null;
   /** Задачи, с которыми связана эта задача */
   related?: TaskSingle[] | null;
   /** Релизная задача, с которой связана эта задача */
   release?: TaskSingle | null;
   /** Задачи, которые блокируют эту задачу */
   block_by?: TaskSingle[];
   /** Задачи, которые связаны с этим эпиком */
   epic_by?: TaskSingle[];
   /** Задачи, которые связаны с этой задачей */
   related_by?: TaskSingle[];
   /** Задачи, которые связаны с этой релизной задачей */
   release_by?: TaskSingle[];
   /** Комментарии к задаче */
   comments?: Comment[];
   /**
    * Проданная оценка
    * @min 0
    */
   estimate_cost?: number;
   /**
    * Оценка разработчика
    * @min 0
    */
   estimate_worker?: number;
   /**
    * Сумма затраченного на задачу времени
    * @min 0
    */
   total_logged_time?: number;
   /** Крайний срок исполнения задачи */
   deadline?: string | null;
   /** Идентификатор пользователя, создавшего задачу */
   created_by?: User;
   /** Дата создания */
   created_at?: string;
   /** Дата обновления */
   updated_at?: string;
   /**
    * Дата начала работ
    * @example "2022-11-30T08:48:00.000000Z"
    */
   begin?: string;
   /**
    * Дата окончания работ
    * @example "2022-12-31T16:48:00.000000Z"
    */
   end?: string;
   /** Стреканное время в связанных багах */
   bugs_tracked_time?: number | null;
   /** Позиция задачи */
   rank?: string;
   /** Id версии редактора текста */
   editor_version?: number;
   history?: {
      changes?: {
         /** Старое значение */
         old?: string;
         /** Новое значение */
         new?: string;
         /** Тип изменения (Поле) */
         type?: string;
      }[];
      /** Дата обновления */
      updated_at?: string;
      /** ID юзера, кто произвел изменение. Будет null, если изменил какой-то скрипт */
      updated_by_id?: number | null;
   }[];
   work_detail?: {
      time_sum?: number;
      /** Роль пользователя на проекте */
      role?: Role;
   }[];
}

export interface TaskGradeUserList {
   tasks?: UserTaskGradeList[];
   /** Идентификатор пользователя */
   id?: number;
   /** Активность */
   is_active?: boolean;
   /** Является ли пользователь администратором */
   is_admin?: boolean;
   /** Может ли грейдировать сотрудников */
   can_grade?: boolean;
   /** Имя пользователя */
   name?: string;
   /** Фамилия пользователя */
   surname?: string;
   /** Отчество пользователя */
   patronymic?: string | null;
   /** Email пользователя */
   email?: string;
   /** Файл */
   avatar?: ResponseFile;
   /** Пол пользователя */
   gender?: Gender;
   telegram?: string;
}

/** Задача, одиночная выборка */
export interface UserTaskGradeList {
   /** Идентификатор задачи */
   id?: number;
   /** Заголовок задачи */
   name?: string;
   /** Описание задачи */
   description?: string;
   /** Компонент задачи */
   component?: Component;
   /** Приоритет задачи */
   priority?: Priority;
   /** Стадия (колонка) задачи */
   stage?: Stage;
   /** Тип задачи */
   task_type?: TaskType;
   /** Проект, одиночная выборка */
   project?: ProjectSingle;
   /** 1 - Новая, 2 - Ожидает оценки, 3 - Проверена */
   status?: number;
}

/** Задача, множественная выборка */
export interface TaskMultiple {
   /** Идентификатор задачи */
   id?: number;
   /** Заголовок задачи */
   name?: string;
   /** Идентификатор компонента задачи */
   component?: number;
   /** Идентификатор приоритета задачи */
   priority?: number;
   /** Идентификатор стадии задачи */
   stage?: number;
   /** Идентификатор типа задачи */
   task_type?: number;
   /** Идентификаторы исполнителей задачи */
   users?: number;
   /** Идентификаторы стадий, на которые можно перевести эту задачу */
   possibleTaskNextStages?: number[];
   /** Крайний срок исполнения задачи */
   deadline?: string | null;
   /** Идентификатор пользователя, создавшего задачу */
   created_by?: number;
   /** Дата создания */
   created_at?: string;
   /** Дата обновления */
   updated_at?: string;
   /**
    * Дата начала работ
    * @example "2022-11-30T08:48:00.000000Z"
    */
   begin?: string;
   /**
    * Дата окончания работ
    * @example "2022-12-31T16:48:00.000000Z"
    */
   end?: string;
   /** Позиция задачи */
   rank?: string;
}

/** Задача, краткий формат */
export interface TaskShort {
   /** Идентификатор задачи */
   id?: number;
   /** Заголовок задачи */
   name?: string;
   /** Идентификатор стадии задачи */
   stage?: number;
   /** Идентификатор типа задачи */
   task_type?: number;
   /** Идентификатор приоритета задачи */
   priority?: number;
   /** Проект, краткий формат */
   project?: ProjectShort;
   /** Позиция задачи */
   rank?: string;
}

/** meta объект пагинации */
export interface PaginationMeta {
   /** Текущая страница */
   current_page?: number;
   /** Номер предыдущей страницы? */
   from?: number;
   /** Номер последней страницы */
   last_page?: number;
   /** Текущий url */
   path?: string;
   /** Сколько элементов выводится */
   per_page?: number;
   /** Кол-во результатов */
   total?: number;
   /** Номер следующей страницы? */
   to?: number;
}

/** Комментарий */
export interface Comment {
   /** Идентификатор комментария */
   id?: number;
   /** Текст комментария. В рамках приложения используется Markdown разметка. Старые задачи возвращают HTML */
   content?: string;
   /** Файлы, прикреплённые к комментарию */
   files?: ResponseFile[];
   /** Пользователь */
   user?: User;
   /** Дата создания */
   created_at?: string;
   /** Дата обновления */
   updated_at?: string;
}

/** Запись о затраченном на задачу времени */
export interface Work {
   /** Идентификатор записи */
   id?: number;
   /** Время в минутах */
   time?: number;
   /** Дата списания времени */
   begin?: string;
   /**
    * Дата окончания работы в рамках этой записи
    * @deprecated
    */
   end?: string | null;
   /** Комментарий к записи */
   comment?: string | null;
   /** Признак, является ли время овертаймом */
   overtime?: boolean;
   /** Пользователь */
   user?: User;
}

/** Смета */
export interface Estimate {
   /** Идентификатор записи */
   id?: number;
   /** Название сметы */
   name?: string;
   /** Итого рублей в смете */
   total_cost?: string;
   /** Итого часов смете */
   total_hours?: string;
   /** Пользователь */
   user?: User;
   estimateItems?: EstimateItem[];
}

/** Пункт сметы */
export interface EstimateItem {
   /** Идентификатор записи */
   id?: number;
   /** Роль пользователя на проекте */
   role?: Role;
   /** Время, ч. */
   time_h?: number;
   /** Ставка */
   rate?: number;
}

/** Компонент задачи */
export interface Component {
   /** Идентификатор компонента */
   id?: number;
   /** Название компонента */
   name?: string;
   /** color*/
   color?: string;
}

/** Стадия (колонка) задачи */
export interface Stage {
   /** Идентификатор стадии */
   id?: number;
   /** Название стадии */
   name?: string;
   /** Цвет стадии */
   color?: string;
}

/** Приоритет задачи */
export interface Priority {
   /** Идентификатор приоритета */
   id?: number;
   /** Название приоритета */
   name?: string;
}

/** Тип задачи */
export interface TaskType {
   /** Идентификатор типа задачи */
   id?: number;
   /** Название типа задачи */
   name?: string;
}

/** Роль пользователя на проекте */
export interface Role {
   /** Идентификатор роли */
   id?: number;
   /** Название роли */
   name?: string;
}

/** Пол пользователя */
export interface Gender {
   /** Идентификатор пола */
   id?: number;
   /** Название пола */
   name?: string;
}

/** Тип проекта */
export interface ProjectType {
   /** Идентификатор пола */
   id?: number;
   /** Название пола */
   name?: string;
}

/** Роль пользователя на проекте. Присутствует только в контексте запроса информации о пользователе */
export type UserProjectRole = {
   /** Идентификатор роли */
   id?: number;
   /** Название роли */
   name?: string;
} | null;

/** Файл */
export type ResponseFile = {
   fileObject: File;
   /** Идентификатор файла */
   id?: number;
   /** Оригинальное название файла */
   original_name?: string;
   /** Ссылка на файл */
   link?: string;
   /** Дата создания */
   created_at?: string;
   /** Дата обновления */
   updated_at?: string;
} | null;

/** Сообщение */
export interface Message {
   /** Идентификатор */
   id?: number;
   /** Текст */
   message?: string;
   /** id адресата */
   user_id?: number;
}

/** Тег пользователя */
export interface Tag {
   /** Идентификатор тега */
   id?: number;
   /** Текст тега */
   tag?: string;
   /**
    * HEX-цвет фона тега
    * @example "ffffff"
    */
   color_bg?: string;
   /**
    * HEX-цвет текста тега
    * @example "17a2b8"
    */
   color_fg?: string;
}

/** Валидационная ошибка */
export interface ValidationError {
   /** Описание ошибки */
   message?: string;
   /**
    * Описание ошибок по полям. Ключи объекта - идентификаторы полей, значения - массив строк с причиной ошибки.
    * @example {"name":["Это поле обязательно"],"slug":["Поле должно содержать 3 и более символов"]}
    */
   errors?: Record<string, string[]>;
}

/** Ошибка запроса */
export interface BadRequestHttpException {
   /** Текст ошибки */
   message?: string;
}

/** Отчет */
export interface Report {
   /** Название отчета */
   name?: string;
   /** Символьный код отчета */
   slug?: string;
}

export interface GradeEntity {
   id?: number;
   name?: string;
   slug?: string;
   order?: number;
   items?: GradeItemEntity[] | null;
}

export interface GradeDirectionEntity {
   id?: number;
   name?: string;
   slug?: string;
   grades?: GradeEntity[] | null;
}

export interface GradeItemEntity {
   id?: number;
   name?: string;
   description?: string;
   /** ID грейда */
   grade_id?: number;
}

/**
 * Сущность отчета по списанному времени. Вложенность объектов зависит от группировки в параметрах запроса.
 * @example {"key":0,"type":"project","title":"Project Name","slug":"PROJSLUG","child":{"key":0,"type":"task","title":"Task Name","project_slug":"PROJSLUG","child":{"key":0,"type":"user","title":"User Name","entires":{"2022-01-01":60,"2022-01-02":30}}}}
 */
export interface TimeReportEntry {
   /** Идентификатор связанного объекта */
   key?: number;
   /** Тип связанного объекта */
   type?: 'project' | 'task' | 'user';
   /** Название связанного объекта */
   title?: string;
   /** slug-проекта; приходит только для типа объекта 'проект' */
   slug?: string | null;
   /** slug-проекта, в котором находится задача; приходит только для типа объекта 'task' */
   project_slug?: string | null;
   /**
    * Списанное время, сгруппированное по датам; в минутах
    * @example {"2022-01-01":60,"2022-01-02":30}
    */
   entries?: Record<string, number>;
   /** Дочерний уровень отчета */
   child?: TimeReportEntry[];
}

/** Сущность отчета по оценочному времени */
export interface EstimateReportEntry {
   /** Идентификатор задачи */
   id?: number;
   /** Название задачи */
   name?: string;
   /** Оценочное время; в минутах */
   estimate?: number;
   /** Сумма списанного времени; в минутах */
   works_sum?: number;
   works?: {
      /** Списанное пользователем время */
      time?: number;
      /** Идентификатор пользователя */
      user_id?: number;
      /** Имя пользователя */
      user_name?: string;
      /** Фамилия пользователя */
      user_surname?: string;
      /** Отчество пользователя */
      user_patronymic?: string;
   }[];
}

/** Исходящий вебхук */
export interface OutgoingWebhook {
   /** Идентификатор вебхука */
   id?: number;
   /** Название вебхука */
   name?: string;
   /** Символьный код обрабатываемого события */
   event?: string;
   /** Абсолютный адрес для вызова при наступлении события */
   url?: string;
   /** Секретный ключ для подтверждения легитимности системы-автора вебхука */
   secret_key?: string;
   /** Активность вебхука */
   is_active?: boolean;
   /** Максимальное время ожидания ответа от удалённой системы по адресу [url] */
   timeout?: number;
   /** Проекты, на которых работает вебхук; пустота означает, что вебхук работает по всем проектам */
   projects?: ProjectSingle[];
}

/** Доступное в системе, обрабатываемое исходящим вебхуком событие */
export interface OutgoingWebhookEvent {
   /** Символьный код обрабатываемого события */
   code?: string;
   /** Название события */
   name?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
   /** set parameter to `true` for call `securityWorker` for this request */
   secure?: boolean;
   /** request path */
   path: string;
   /** content type of request body */
   type?: ContentType;
   /** query params */
   query?: QueryParamsType;
   /** format of response (i.e. response.json() -> format: "json") */
   format?: ResponseFormat;
   /** request body */
   body?: unknown;
   /** base url */
   baseUrl?: string;
   /** request cancellation token */
   cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
   baseUrl?: string;
   baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
   securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
   customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
   data: D;
   error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
   Json = 'application/json',
   FormData = 'multipart/form-data',
   UrlEncoded = 'application/x-www-form-urlencoded',
   Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
   public baseUrl: string = 'http://localhost/api';
   private securityData: SecurityDataType | null = null;
   private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
   private abortControllers = new Map<CancelToken, AbortController>();
   private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

   private baseApiParams: RequestParams = {
      credentials: 'same-origin',
      headers: {},
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
   };

   constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
      Object.assign(this, apiConfig);
   }

   public setSecurityData = (data: SecurityDataType | null) => {
      this.securityData = data;
   };

   protected encodeQueryParam(key: string, value: any) {
      const encodedKey = encodeURIComponent(key);
      return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
   }

   protected addQueryParam(query: QueryParamsType, key: string) {
      return this.encodeQueryParam(key, query[key]);
   }

   protected addArrayQueryParam(query: QueryParamsType, key: string) {
      const value = query[key];
      return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
   }

   protected toQueryString(rawQuery?: QueryParamsType): string {
      const query = rawQuery || {};
      const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
      return keys
         .map((key) =>
            Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)
         )
         .join('&');
   }

   protected addQueryParams(rawQuery?: QueryParamsType): string {
      const queryString = this.toQueryString(rawQuery);
      return queryString ? `?${queryString}` : '';
   }

   private contentFormatters: Record<ContentType, (input: any) => any> = {
      [ContentType.Json]: (input: any) =>
         input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
      [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
      [ContentType.FormData]: (input: any) =>
         Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            formData.append(
               key,
               property instanceof Blob
                  ? property
                  : typeof property === 'object' && property !== null
                    ? JSON.stringify(property)
                    : `${property}`
            );
            return formData;
         }, new FormData()),
      [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
   };

   protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
      return {
         ...this.baseApiParams,
         ...params1,
         ...(params2 || {}),
         headers: {
            ...(this.baseApiParams.headers || {}),
            ...(params1.headers || {}),
            ...((params2 && params2.headers) || {}),
         },
      };
   }

   protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
      if (this.abortControllers.has(cancelToken)) {
         const abortController = this.abortControllers.get(cancelToken);
         if (abortController) {
            return abortController.signal;
         }
         return void 0;
      }

      const abortController = new AbortController();
      this.abortControllers.set(cancelToken, abortController);
      return abortController.signal;
   };

   public abortRequest = (cancelToken: CancelToken) => {
      const abortController = this.abortControllers.get(cancelToken);

      if (abortController) {
         abortController.abort();
         this.abortControllers.delete(cancelToken);
      }
   };

   public request = async <T = any, E = any>({
      body,
      secure,
      path,
      type,
      query,
      format,
      baseUrl,
      cancelToken,
      ...params
   }: FullRequestParams): Promise<HttpResponse<T, E>> => {
      const secureParams =
         ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
            this.securityWorker &&
            (await this.securityWorker(this.securityData))) ||
         {};
      const requestParams = this.mergeRequestParams(params, secureParams);
      const queryString = query && this.toQueryString(query);
      const payloadFormatter = this.contentFormatters[type || ContentType.Json];
      const responseFormat = format || requestParams.format;

      return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
         ...requestParams,
         headers: {
            ...(requestParams.headers || {}),
            ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
         },
         signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
         body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
      }).then(async (response) => {
         const r = response.clone() as HttpResponse<T, E>;
         r.data = null as unknown as T;
         r.error = null as unknown as E;

         const data = !responseFormat
            ? r
            : await response[responseFormat]()
                 .then((data) => {
                    if (r.ok) {
                       r.data = data;
                    } else {
                       r.error = data;
                    }
                    return r;
                 })
                 .catch((e) => {
                    r.error = e;
                    return r;
                 });

         if (cancelToken) {
            this.abortControllers.delete(cancelToken);
         }

         if (!response.ok) throw data;
         return data;
      });
   };
}

/**
 * @title DS KANBAN API
 * @version 1.0.0
 * @baseUrl http://localhost/api
 *
 * API канбана
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
   auth = {
      /**
       * @description Запрос на получение авторизационного токена по логину и паролю.
       *
       * @tags Пользователь
       * @name TokenCreate
       * @summary Авторизация
       * @request POST:/auth/token
       * @secure
       */
      tokenCreate: (
         query: {
            /**
             * Email пользователя
             * @min 3
             */
            email: string;
            /**
             * Пароль пользователя
             * @format password
             * @min 1
             */
            password: string;
         },
         params: RequestParams = {}
      ) =>
         this.request<
            {
               /** Символьный код текущей страницы */
               token?: string;
            },
            void
         >({
            path: `/auth/token`,
            method: 'POST',
            query: query,
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на получение данных текущего авторизованного пользователя.
       *
       * @tags Пользователь
       * @name UserList
       * @summary Получение данных текущего пользователя
       * @request GET:/auth/user
       * @secure
       */
      userList: (params: RequestParams = {}) =>
         this.request<
            {
               /** Пользователь */
               data?: User;
            },
            void
         >({
            path: `/auth/user`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),
   };
   user = {
      /**
       * @description Запрос на получение данных конкретного пользователя.
       *
       * @tags Пользователь
       * @name UserDetail
       * @summary Получение данных пользователя
       * @request GET:/user/{id}
       * @secure
       */
      userDetail: (id: number, params: RequestParams = {}) =>
         this.request<
            {
               /** Пользователь */
               data?: User;
            },
            void
         >({
            path: `/user/${id}`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),
   };
   project = {
      /**
       * @description Запрос на получение списка проектов текущего пользователя. Опциональный параметр, доступный для менеджеров, позволяет получить список всех проектов. Для админов возвращает все проекты.
       *
       * @tags Проект
       * @name ProjectList
       * @summary Получение списка проектов
       * @request GET:/project
       * @secure
       */
      projectList: (
         query?: {
            /**
             * Запросить список всех проектов. Доступен для менеджеров. При использовании не от менеджера или админа вернёт ошибку.
             * @min 0
             * @max 1
             */
            all?: number;
         },
         params: RequestParams = {}
      ) =>
         this.request<
            {
               data?: ProjectMultiple[];
            },
            any
         >({
            path: `/project`,
            method: 'GET',
            query: query,
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на получение данных о проекте по его символьному идентификатору.
       *
       * @tags Проект
       * @name ProjectDetail
       * @summary Получение данных о проекте
       * @request GET:/project/{slug}
       * @secure
       */
      projectDetail: (slug: string, params: RequestParams = {}) =>
         this.request<
            {
               /** Проект, одиночная выборка */
               data?: ProjectSingle;
            },
            void
         >({
            path: `/project/${slug}`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на получение списка задач проекта по его символьному идентификатору.
       *
       * @tags Задачи
       * @name TaskDetail
       * @summary Получение списка задач проекта
       * @request GET:/project/{slug}/task
       * @secure
       */
      taskDetail: (
         slug: string,
         query?: {
            /** Фильтр по идентификатору задачи */
            'filter[id][]'?: number[];
            /** Фильтр по названию задачи */
            'filter[name]'?: string;
            /** Фильтр по исполнителям задачи */
            'filter[user_id][]'?: number[];
            /** Фильтр по типу задачи <br>1 - Баг <br>2 - Задача <br>3 - Улучшение <br>4 - Новая функциональность <br>5 - Эпик <br>6 - Релиз <br>7 - Бэклог */
            'filter[type_id][]'?: number[];
         },
         params: RequestParams = {}
      ) =>
         this.request<
            {
               data?: TaskMultiple[];
            },
            any
         >({
            path: `/project/${slug}/task`,
            method: 'GET',
            query: query,
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на создание новой задачи в проекте.
       *
       * @tags Задачи
       * @name TaskCreate
       * @summary Создание новой задачи в проекте
       * @request POST:/project/{slug}/task
       * @secure
       */
      taskCreate: (
         slug: string,
         data: {
            /** Название задачи */
            name: string;
            /** Описание задачи */
            description: string | null;
            /** Стадия (колонка) задачи. Использовать только стадии доступные для данного проекта. */
            stage_id: number;
            /** Тип задачи */
            task_type_id: number;
            /** Компонент задачи. Использовать только компоненты доступные для данного проекта. Обязательное для всех типов задач кроме Эпик и Бэклог. */
            component_id?: number;
            /** Приоритет задачи */
            priority_id: number;
            /** Задача, которую блокирует создаваемая */
            block_id?: number | null;
            /** Релиз, в котором находится создаваемая задача */
            release_id?: number | null;
            /** Задача, с которой связана создаваемая */
            related_id?: number | null;
            /** Эпик, к которому привязана создаваемая задача */
            epic_id?: number | null;
            /** Проданная оценка */
            estimate_cost?: number | null;
            /** Оценка разработчика */
            estimate_worker?: number | null;
            /** Ссылка на макет */
            layout_link?: string | null;
            /** Ссылка на вёрстку */
            markup_link?: string | null;
            /** Ссылка на сборку */
            dev_link?: string | null;
            /** Исполнители задачи */
            executors?: number[];
            /**
             * Дата начала работ
             * @example "2022-11-30T08:48:00.000000Z"
             */
            begin?: string;
            /**
             * Дата окончания работ
             * @example "2022-12-31T16:48:00.000000Z"
             */
            end?: string;
         },
         params: RequestParams = {}
      ) =>
         this.request<TaskSingle, void | ValidationError>({
            path: `/project/${slug}/task`,
            method: 'POST',
            body: data,
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на получение списка юзеров на задачах проекта по его символьному идентификатору.
       *
       * @tags Участники проекта
       * @name UserDetail
       * @summary Получение списка пользователей на задачах проекта
       * @request GET:/project/{slug}/user
       * @secure
       */
      userDetail: (slug: string, params: RequestParams = {}) =>
         this.request<User[], void>({
            path: `/project/${slug}/user`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),
   };
   task = {
      /**
       * @description Запрос на получение детальной информацию о задаче по ей идентификатору.
       *
       * @tags Задачи
       * @name TaskDetail
       * @summary Получение информации о задаче
       * @request GET:/task/{id}
       * @secure
       */
      taskDetail: (id: number, params: RequestParams = {}) =>
         this.request<TaskSingle, void>({
            path: `/task/${id}`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на обновление полей задачи.
       *
       * @tags Задачи
       * @name TaskPartialUpdate
       * @summary Обновление задачи
       * @request PATCH:/task/{id}
       * @secure
       */
      taskPartialUpdate: (
         id: number,
         data: {
            /** Название задачи */
            name?: string | null;
            /** Описание задачи */
            description?: string | null;
            /** Стадия (колонка) задачи. Использовать только стадии доступные для данного проекта. */
            stage_id?: number | null;
            /** Тип задачи */
            task_type_id?: number | null;
            /** Компонент задачи. Использовать только компоненты доступные для данного проекта. */
            component_id?: number | null;
            /** Приоритет задачи */
            priority_id?: number | null;
            /** Задача, которую блокирует создаваемая */
            block_id?: number | null;
            /** Релиз, в котором находится создаваемая задача */
            release_id?: number | null;
            /** Задача, с которой связана создаваемая */
            related_id?: number | null;
            /** Эпик, к которому привязана создаваемая задача */
            epic_id?: number | null;
            /** Проданная оценка */
            estimate_cost?: number | null;
            /** Оценка разработчика */
            estimate_worker?: number | null;
            /** Ссылка на макет */
            layout_link?: string | null;
            /** Ссылка на вёрстку */
            markup_link?: string | null;
            /** Ссылка на сборку */
            dev_link?: string | null;
            /** Исполнители задачи */
            executors?: number[];
            /**
             * Дата начала работ
             * @example "2022-11-30T08:48:00.000000Z"
             */
            begin?: string;
            /**
             * Дата окончания работ
             * @example "2022-12-31T16:48:00.000000Z"
             */
            end?: string;
         },
         params: RequestParams = {}
      ) =>
         this.request<TaskSingle, void | ValidationError>({
            path: `/task/${id}`,
            method: 'PATCH',
            body: data,
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на "мягкое удаление" задачи. <br>Мягкое удаление означает, что пользователь фактически остаётся в БД, но не может быть использован и выбран.
       *
       * @tags Задачи
       * @name TaskDelete
       * @summary Удаление задачи
       * @request DELETE:/task/{id}
       * @secure
       */
      taskDelete: (id: number, params: RequestParams = {}) =>
         this.request<TaskSingle, void>({
            path: `/task/${id}`,
            method: 'DELETE',
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на прикрепление указанного файла к задаче
       *
       * @tags Файлы задач
       * @name FilePartialUpdate
       * @summary Прикрепление файла к задаче
       * @request PATCH:/task/{id}/file/{file}
       * @secure
       */
      filePartialUpdate: (id: number, file: number, params: RequestParams = {}) =>
         this.request<TaskSingle, void>({
            path: `/task/${id}/file/${file}`,
            method: 'PATCH',
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на удаление файла из задачи. Это действие не удаляет файл с сервера.
       *
       * @tags Файлы задач
       * @name FileDelete
       * @summary Удаление файла из задачи
       * @request DELETE:/task/{id}/file/{file}
       * @secure
       */
      fileDelete: (id: number, file: number, params: RequestParams = {}) =>
         this.request<TaskSingle, void>({
            path: `/task/${id}/file/${file}`,
            method: 'DELETE',
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на получение списка комментариев по задаче. <br>Список комментариев может запросить только пользователь, участвующий в работе над задачей. <br>Рекомендуется использовать этот метод только если не доступно получение детальной информации о задаче. В противном случае получать комментарии задачи следует из поля [comments] задачи.
       *
       * @tags Комментарии задач
       * @name CommentDetail
       * @summary Список комментариев задачи
       * @request GET:/task/{id}/comment
       * @secure
       */
      commentDetail: (id: number, params: RequestParams = {}) =>
         this.request<
            {
               data?: Comment[];
            },
            void
         >({
            path: `/task/${id}/comment`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на создание комментария привязанного к указанной задаче.
       *
       * @tags Комментарии задач
       * @name CommentCreate
       * @summary Создание комментария к задаче
       * @request POST:/task/{id}/comment
       * @secure
       */
      commentCreate: (
         id: number,
         data: {
            /** Тело комментария */
            content: string;
            /** Прикреплённые файлы */
            files?: number[] | null;
         },
         params: RequestParams = {}
      ) =>
         this.request<Comment, void>({
            path: `/task/${id}/comment`,
            method: 'POST',
            body: data,
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на получение всех записей о списанном времени.
       *
       * @tags Списанное время
       * @name WorkDetail
       * @summary Получение списанного в задачу времени
       * @request GET:/task/{id}/work
       * @secure
       */
      workDetail: (id: number, params: RequestParams = {}) =>
         this.request<
            {
               data?: Work[];
            },
            void
         >({
            path: `/task/${id}/work`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на добавление списанного времени в задачу
       *
       * @tags Списанное время
       * @name WorkCreate
       * @summary Добавление списанного времени в задачу
       * @request POST:/task/{id}/work
       * @secure
       */
      workCreate: (id: number, params: RequestParams = {}) =>
         this.request<Work, void | ValidationError>({
            path: `/task/${id}/work`,
            method: 'POST',
            secure: true,
            format: 'json',
            ...params,
         }),
   };
   comment = {
      /**
       * @description Запрос на получение комментария. <br>Получение конкретного комментария доступно только пользователю, который его создал или админу. <br>Рудиментный функционал, может быть изменён/удалён и не рекомендуется к использованию.
       *
       * @tags Комментарии
       * @name CommentDetail
       * @summary Получение комментария
       * @request GET:/comment/{id}
       * @deprecated
       * @secure
       */
      commentDetail: (id: number, params: RequestParams = {}) =>
         this.request<Comment, void>({
            path: `/comment/${id}`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на обновление комментария. Редактировать комментарий может только автор или админ.
       *
       * @tags Комментарии
       * @name CommentPartialUpdate
       * @summary Обновление комментария
       * @request PATCH:/comment/{id}
       * @secure
       */
      commentPartialUpdate: (
         id: number,
         data: {
            /** Тело комментария */
            content: string;
            /** Прикреплённые файлы */
            files?: number[] | null;
         },
         params: RequestParams = {}
      ) =>
         this.request<Comment, void | ValidationError>({
            path: `/comment/${id}`,
            method: 'PATCH',
            body: data,
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на удаление комментария. Удалить комментарий может только автор или админ.
       *
       * @tags Комментарии
       * @name CommentDelete
       * @summary Удаление комментария
       * @request DELETE:/comment/{id}
       * @secure
       */
      commentDelete: (id: number, params: RequestParams = {}) =>
         this.request<Comment, void>({
            path: `/comment/${id}`,
            method: 'DELETE',
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на прикрепление указанного файла к комментарию
       *
       * @tags Файлы комментариев
       * @name FilePartialUpdate
       * @summary Прикрепление файла к комментарию
       * @request PATCH:/comment/{id}/file/{file}
       * @secure
       */
      filePartialUpdate: (id: number, file: number, params: RequestParams = {}) =>
         this.request<Comment, void>({
            path: `/comment/${id}/file/${file}`,
            method: 'PATCH',
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на удаление файла из комментария. Это действие не удаляет файл с сервера.
       *
       * @tags Файлы комментариев
       * @name FileDelete
       * @summary Удаление файла из комментария
       * @request DELETE:/comment/{id}/file/{file}
       * @secure
       */
      fileDelete: (id: number, file: number, params: RequestParams = {}) =>
         this.request<Comment, void>({
            path: `/comment/${id}/file/${file}`,
            method: 'DELETE',
            secure: true,
            format: 'json',
            ...params,
         }),
   };
   work = {
      /**
       * @description Запрос на получение записи о списанном времени. <br>Доступно только пользователям, участвующим в задаче, в которую было списано время.
       *
       * @tags Списанное время
       * @name WorkDetail
       * @summary Получение записи о списанном времени
       * @request GET:/work/{id}
       * @secure
       */
      workDetail: (id: number, params: RequestParams = {}) =>
         this.request<Work, void>({
            path: `/work/${id}`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на редактирование записи о списанном времени. <br>Редактирование записи доступно только её создателю или админу.
       *
       * @tags Списанное время
       * @name WorkPartialUpdate
       * @summary Обновление записи о списанном времени
       * @request PATCH:/work/{id}
       * @secure
       */
      workPartialUpdate: (id: number, params: RequestParams = {}) =>
         this.request<Work, void | ValidationError>({
            path: `/work/${id}`,
            method: 'PATCH',
            secure: true,
            format: 'json',
            ...params,
         }),

      /**
       * @description Запрос на удаление записи о списанном времени. <br>Удаление записи доступно только её создателю или админу.
       *
       * @tags Списанное время
       * @name WorkDelete
       * @summary Удаление записи о списанном времени
       * @request DELETE:/work/{id}
       * @secure
       */
      workDelete: (id: number, params: RequestParams = {}) =>
         this.request<Work, void>({
            path: `/work/${id}`,
            method: 'DELETE',
            secure: true,
            format: 'json',
            ...params,
         }),
   };
   favorite = {
      /**
       * @description Запрос на добавление сущностей в избранное.
       *
       * @tags Избранное
       * @name FavoriteCreate
       * @summary Добавление в избранное
       * @request POST:/favorite
       * @secure
       */
      favoriteCreate: (
         data: {
            /** Идентификатор добавляемой в избранное сущности */
            id?: number;
            /** Тип добавляемой сущности */
            type?: 'project';
         },
         params: RequestParams = {}
      ) =>
         this.request<
            void,
            {
               message?: string;
            } | void
         >({
            path: `/favorite`,
            method: 'POST',
            body: data,
            secure: true,
            type: ContentType.Json,
            ...params,
         }),

      /**
       * @description Запрос на удаление сущностей из избранного
       *
       * @tags Избранное
       * @name FavoriteDelete
       * @summary Удаление из избранного
       * @request DELETE:/favorite
       * @secure
       */
      favoriteDelete: (
         data: {
            /** Идентификатор удаляемой из избранного сущности */
            id?: number;
            /** Тип удаляемой сущности */
            type?: 'project';
         },
         params: RequestParams = {}
      ) =>
         this.request<
            void,
            {
               message?: string;
            } | void
         >({
            path: `/favorite`,
            method: 'DELETE',
            body: data,
            secure: true,
            type: ContentType.Json,
            ...params,
         }),
   };
   file = {
      /**
       * @description Запрос на загрузку и сохранение файла на сервер приложения.
       *
       * @tags Файлы
       * @name FileCreate
       * @summary Загрузка файла
       * @request POST:/file
       * @secure
       */
      fileCreate: (
         data: {
            file?: ResponseFile[];
         },
         params: RequestParams = {}
      ) =>
         this.request<ResponseFile, void | ValidationError>({
            path: `/file`,
            method: 'POST',
            body: data,
            secure: true,
            type: ContentType.FormData,
            format: 'json',
            ...params,
         }),
   };
   component = {
      /**
       * @description Получает список всех доступных в системе компонентов задач. <br>Примечание: для получения доступных компонентов следует использовать поле flow.possibleProjectComponents из запроса на получение конкретного проекта!
       *
       * @tags Справочники
       * @name ComponentList
       * @summary Получение списка компонентов
       * @request GET:/component
       * @secure
       */
      componentList: (params: RequestParams = {}) =>
         this.request<Component[], any>({
            path: `/component`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),
   };
   priority = {
      /**
       * @description Получает список всех доступных в системе приоритетов задач
       *
       * @tags Справочники
       * @name PriorityList
       * @summary Получение списка приоритетов
       * @request GET:/priority
       * @secure
       */
      priorityList: (params: RequestParams = {}) =>
         this.request<Priority[], any>({
            path: `/priority`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),
   };
   taskType = {
      /**
       * @description Получает список всех доступных в системе типов задач
       *
       * @tags Справочники
       * @name TaskTypeList
       * @summary Получение списка типов задач
       * @request GET:/task_type
       * @secure
       */
      taskTypeList: (params: RequestParams = {}) =>
         this.request<TaskType[], any>({
            path: `/task_type`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),
   };
   projectType = {
      /**
       * @description Получает список всех доступных в системе типов проектов
       *
       * @tags Справочники
       * @name ProjectTypeList
       * @summary Получение списка типов проектов
       * @request GET:/project_type
       * @secure
       */
      projectTypeList: (params: RequestParams = {}) =>
         this.request<ProjectType[], any>({
            path: `/project_type`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),
   };
   stage = {
      /**
       * @description Получает список всех доступных в системе стадий задачи. <br>Примечание: для получения доступных стадий следует использовать поле flow.possibleProjectStages из запроса на получение конкретного проекта!
       *
       * @tags Справочники
       * @name StageList
       * @summary Получение списка стадий (колонок канбана)
       * @request GET:/stage
       * @secure
       */
      stageList: (params: RequestParams = {}) =>
         this.request<TaskType[], any>({
            path: `/stage`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),
   };
   role = {
      /**
       * @description Получает список всех доступных в системе ролей пользователей
       *
       * @tags Справочники
       * @name RoleList
       * @summary Получение списка ролей
       * @request GET:/role
       * @secure
       */
      roleList: (params: RequestParams = {}) =>
         this.request<Role[], any>({
            path: `/role`,
            method: 'GET',
            secure: true,
            format: 'json',
            ...params,
         }),
   };
}

export type FormDataType = {
   email: string;
   password: string;
};

export interface ServerResponse {
   token: string | undefined;
}

export interface LoginRequest {
   email: string;
   password: string;
}
