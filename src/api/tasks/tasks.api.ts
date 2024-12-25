import type { Api, Component } from '../data.types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from '@/utils/cookies';
import { TaskSingle, TaskMultiple, TaskType, Stage, Priority } from '@/api/data.types';
import { BASE_API_URL } from '@/consts';
import { prepareHeaders } from '@/utils/api';
import { TypeRootState } from '@/store/store';

type TaskUpType = Parameters<Api<unknown>['task']['taskPartialUpdate']>[1]

type TaskFilterType = {
   name?: string,
   user_id?: number[],
   type_id?: number[],
   date_start_from?: string | null,
   date_start_to?: string | null,
   date_end_from?: string | null,
   date_end_to?: string | null,
};

export const tasksApi = createApi({
   tagTypes: ['Task', 'Tasks'],
   reducerPath: 'api/tasks',
   baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL, prepareHeaders }),
   endpoints: (build) => ({
      getTaskTypes: build.query<{ data: Array<TaskType> }, void>({ query: () => `/task_type` }),
      getTaskTags: build.query<{ data: Array<Component & { color?: string }> }, void>({ query: () => `/component` }),
      getTaskPriorities: build.query<{ data: Array<Priority> }, void>({ query: () => `/priority` }),
      getTask: build.query<{ data: TaskSingle }, string>({ query: (id: string) => `/task/${id}`, providesTags: ['Task'], }),
      getAllTasks: build.query<{ data: Array<TaskMultiple> }, { slug: string, taskFilter?: TaskFilterType }>({
         query: ({ slug, taskFilter }) => {

            const baseUrl = `/project/${slug}/task`
            let uriOptions = []
            if (taskFilter?.name && taskFilter.name.length >= 3) {  //  && taskFilter.name.length >= 3
               uriOptions.push(`filter[name]=` + taskFilter.name)
            }
            // else {}
            if (taskFilter?.user_id) {
               taskFilter?.user_id.forEach(user => {
                  uriOptions.push(`filter[user_id][]=` + user)
               })
            }
            if (taskFilter?.type_id) {
               taskFilter?.type_id.forEach(tasktype => {
                  uriOptions.push(`filter[type_id][]=` + tasktype)
               })
            }
            if (taskFilter?.date_start_from) uriOptions.push(`filter[date_start_from]=` + taskFilter.date_start_from)
            if (taskFilter?.date_start_to) uriOptions.push(`filter[date_start_to]=` + taskFilter.date_start_to)
            if (taskFilter?.date_end_from) uriOptions.push(`filter[date_end_from]=` + taskFilter.date_end_from)
            if (taskFilter?.date_end_to) uriOptions.push(`filter[date_end_to]=` + taskFilter.date_end_to)

            return baseUrl + (uriOptions.length ? `?${encodeURI(uriOptions.join('&'))}` : '');
         },
         providesTags: ['Tasks'],
      }),

      updateTask: build.mutation<TaskSingle, Partial<TaskUpType> & { id: number, projectslug: string }>({
         query: (task) => {            
            const { id, ...patch } = task;
            return {
               url: `/task/${id}`,
               method: 'PATCH',
               body: patch,
            }
         },
         async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
               tasksApi.util.updateQueryData('getAllTasks', { slug: patch.projectslug }, (draft) => {
                  Object.assign(draft, patch)
               })
            )
            try {
               await queryFulfilled
            } catch {
               patchResult.undo()

               /**
                * Alternatively, on failure you can invalidate the corresponding cache tags
                * to trigger a re-fetch:
                * dispatch(api.util.invalidateTags(['Post']))
                */
            }
         },
         invalidatesTags: ['Tasks']
         // transformResponse: (response: { data: TaskMultiple }, meta, arg) => response.data,
      })
      // getTaskStages: build.query<{ data: Array<Stage> }, void>({ query: () => `/stage` }),
   }),
});

export const {
   useGetAllTasksQuery,
   useGetTaskPrioritiesQuery,
   useGetTaskTagsQuery,
   useGetTaskTypesQuery,
   useGetTaskQuery,

   useLazyGetTaskQuery,
   useLazyGetAllTasksQuery,

   useUpdateTaskMutation
   // useLazyGetTaskPrioritiesQuery,
   // useGetTaskStagesQuery
} = tasksApi;


/**
 * @link { https://stackoverflow.com/questions/76212082/how-to-use-rtk-query-in-combination-with-selectors }
 * @link {https://dev.to/riyadhossain/how-to-use-redux-toolkit-rtk-query-in-react-42l2}
 */
//
export const selectPriorities = (state: TypeRootState) => tasksApi.endpoints.getTaskPriorities.select()(state).data;
