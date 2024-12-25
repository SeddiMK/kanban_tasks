import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from '@/utils/cookies';
import { TaskSingle, TaskMultiple, User, ResponseFile, Comment } from '@/api/data.types';
import { BASE_URL } from '@/consts';
import { LoginRequest, ServerResponse } from './data.types';

const token = getCookie('token-auth');
export const BASE_URL_API = BASE_URL + 'api';

export const appApi = createApi({
   reducerPath: 'api/single_task',
   baseQuery: fetchBaseQuery({ baseUrl: BASE_URL_API, credentials: 'same-origin' }),
   endpoints: (build) => ({
      getTaskByTaskId: build.query<{ data: TaskSingle }, number>({
         query: (id: number) => ({
            url: `/task/${id}`,
            headers: {
               Authorization: `Bearer ${token}`,
               accept: 'application/json',
            },
         }),
      }),
      updateTask: build.mutation<{ data: TaskSingle }, { id: number; body: Partial<TaskMultiple> }>({
         query: ({ id, body }) => ({
            url: `/task/${id}`,
            method: 'PATCH',
            body: body,
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }),
      }),
      createTask: build.mutation<{ data: TaskSingle }, { slug: string; body: Partial<TaskMultiple> }>({
         query: ({ slug, body }) => ({
            url: `/project/${slug}/task`,
            method: 'POST',
            body,
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }),
      }),
      deleteTask: build.mutation<{ data: TaskSingle }, number>({
         query: (id) => ({
            url: `/task/${id}`,
            method: 'DELETE',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }),
      }),
      getTasks: build.query<TaskSingle[], { slug: string; filters?: Record<string, string | number | number[]> }>({
         query: ({ slug, filters }) => {
            const searchParams = new URLSearchParams();
            if (filters) {
               Object.entries(filters).forEach(([key, value]) => {
                  if (Array.isArray(value)) {
                     // Если значение — массив, добавляем каждый элемент
                     value.forEach((v) => searchParams.append(`filter[${key}][]`, v.toString()));
                  } else {
                     // Если значение — строка или число
                     searchParams.append(`filter[${key}][]`, value.toString());
                  }
               });
            }
            return {
               url: `/project/${slug}/task?${searchParams.toString()}`,
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            };
         },
      }),
      getUsers: build.query<{ data: User[] }, string>({
         query: (slug) => ({
            url: `/project/${slug}/user`,
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }),
      }),
      getAllTasks: build.query<TaskMultiple, string>({
         query: (slug: string) => ({
            url: `/project/${slug}/task`,
            headers: {
               accept: 'application/json',
               Authorization: `Bearer ${token}`,
            },
         }),
      }),
      getCurrentUser: build.query<{ data: User }, void>({
         query: () => ({
            url: '/auth/user',
            headers: {
               accept: 'application/json',
               Authorization: `Bearer ${token}`,
            },
         }),
      }),
      sendFiles: build.mutation<{ data: ResponseFile[] }, FormData>({
         query: (form: FormData) => ({
            url: '/file',
            method: 'POST',
            headers: {
               accept: 'application/json',
               Authorization: `Bearer ${token}`,
            },
            body: form,
         }),
      }),
      addFilesToTask: build.mutation<{ data: TaskSingle }, { task: number; file: number }>({
         query: ({ task, file }) => ({
            url: `/task/${task}/file/${file}`,
            method: 'PATCH',
            headers: {
               accept: 'application/json',
               Authorization: `Bearer ${token}`,
            },
         }),
      }),
      delFilesFromTask: build.mutation<{ data: TaskSingle }, { task: number; file: number }>({
         query: ({ task, file }) => ({
            url: `/task/${task}/file/${file}`,
            method: 'DELETE',
            headers: {
               accept: 'application/json',
               Authorization: `Bearer ${token}`,
            },
         }),
      }),
      addFilesToCommemt: build.mutation<{ data: Comment }, { comment: number; file: number }>({
         query: ({ comment, file }) => ({
            url: `/comment/${comment}/file/${file}`,
            method: 'PATCH',
            headers: {
               accept: 'application/json',
               Authorization: `Bearer ${token}`,
            },
         }),
      }),
      delFilesFromComment: build.mutation<{ data: Comment }, { comment: number; file: number }>({
         query: ({ comment, file }) => ({
            url: `/comment/${comment}/file/${file}`,
            method: 'DELETE',
            headers: {
               accept: 'application/json',
               Authorization: `Bearer ${token}`,
            },
         }),
      }),
      createComment: build.mutation<{ data: Comment }, { id: number; content: string; files: number[] }>({
         query: ({ id, content, files }) => ({
            url: `/task/${id}/comment`,
            method: 'POST',
            headers: {
               accept: 'application/json',
               Authorization: `Bearer ${token}`,
            },
            body: {
               content: content,
               files: files,
            },
         }),
      }),
      patchComment: build.mutation<{ data: Comment }, { id: number; content: string; files: number[] }>({
         query: ({ id, content, files }) => ({
            url: `/comment/${id}`,
            method: 'PATCH',
            headers: {
               accept: 'application/json',
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
            body: {
               content: content,
               files: files,
            },
         }),
      }),
      deleteComment: build.mutation<{ data: Comment }, number>({
         query: (id: number) => ({
            url: `/comment/${id}`,
            method: 'DELETE',
            headers: {
               accept: 'application/json',
               Authorization: `Bearer ${token}`,
            },
         }),
      }),
      getOAuthToken: build.mutation<ServerResponse, LoginRequest>({
         query: ({ email, password }) => ({
            url: `/auth/token?email=${email}&password=${password}`,
            method: 'POST',
         }),
      }),
   }),
});

export const {
   useGetTaskByTaskIdQuery,
   useUpdateTaskMutation,
   useCreateTaskMutation,
   useDeleteTaskMutation,
   useGetTasksQuery,
   useGetUsersQuery,
   useGetAllTasksQuery,
   useGetCurrentUserQuery,
   useSendFilesMutation,
   useAddFilesToTaskMutation,
   useDelFilesFromTaskMutation,
   useAddFilesToCommemtMutation,
   useDelFilesFromCommentMutation,
   useCreateCommentMutation,
   usePatchCommentMutation,
   useDeleteCommentMutation,
   useGetOAuthTokenMutation,
} = appApi;
