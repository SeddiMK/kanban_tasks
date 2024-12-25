import { TaskSingle, User, Component, Priority, TaskType, ResponseFile, TaskMultiple } from '@/api/data.types';
import { BASE_API_URL } from '@/consts';
import { getCookie } from '@/utils/cookies';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const token = getCookie('token-auth');

export const taskApiActions = createApi({
   reducerPath: 'api/single_task_actions',
   baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL }),
   endpoints: (build) => ({
      getTaskByTaskId: build.query<{ data: TaskSingle }, number>({
         query: (id: number) => ({
            url: `/task/${id}`,
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }),
      }),

      getTasks: build.query<TaskMultiple, { slug: string; filters?: Record<string, string | number | number[]> }>({
         query: ({ slug, filters }) => {
            const searchParams = new URLSearchParams();
            if (filters) {
               Object.entries(filters).forEach(([key, value]) => {
                  if (Array.isArray(value)) {
                     value.forEach((v) => searchParams.append(`filter[${key}][]`, v.toString()));
                  } else {
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

      getUsers: build.query<User[], string>({
         query: (slug) => ({
            url: `/project/${slug}/user`,
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }),
      }),

      getComponents: build.query<{ data: Component[] }, void>({
         query: () => ({
            url: `/component`,
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }),
      }),

      getPriorities: build.query<{ data: Priority[] }, void>({
         query: () => ({
            url: `/priority`,
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }),
      }),

      getTaskTypes: build.query<{ data: TaskType[] }, void>({
         query: () => ({
            url: `/task_type`,
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }),
      }),

      updateTask: build.mutation<{ data: TaskSingle }, { id: number; body: Partial<TaskSingle> }>({
         query: ({ id, body }) => ({
            url: `/task/${id}`,
            method: 'PATCH',
            body: body,
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }),
      }),

      createTask: build.mutation<{ data: TaskSingle }, { slug: string; body: Partial<TaskSingle> }>({
         query: ({ slug, body }) => ({
            url: `/project/${slug}/task`,
            method: 'POST',
            body,
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }),
      }),

      deleteTask: build.mutation<void, number>({
         query: (id) => ({
            url: `/task/${id}`,
            method: 'DELETE',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }),
      }),

      sendFilesTask: build.mutation<ResponseFile, { taskId: number; fileId: number | undefined }>({
         query: ({ taskId, fileId }) => ({
            url: `/task/${taskId}/file/${fileId}`,
            method: 'PATCH',
            headers: {
               accept: 'application/json',
               Authorization: `Bearer ${token}`,
            },
         }),
      }),
      deleteFileTask: build.mutation<void, { taskId: number; fileId: number | undefined }>({
         query: ({ taskId, fileId }) => ({
            url: `/task/${taskId}/file/${fileId}`,
            method: 'DELETE',
            headers: {
               accept: 'application/json',
               Authorization: `Bearer ${token}`,
            },
         }),
      }),
   }),
});

export const {
   useGetTaskByTaskIdQuery,
   useGetTasksQuery,
   useGetUsersQuery,
   useGetComponentsQuery,
   useGetPrioritiesQuery,
   useGetTaskTypesQuery,
   useUpdateTaskMutation,
   useCreateTaskMutation,
   useDeleteTaskMutation,
   useSendFilesTaskMutation,
   useDeleteFileTaskMutation,
} = taskApiActions;
