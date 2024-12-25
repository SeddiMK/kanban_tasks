import { prepareHeaders } from '../../../utils/api';
import { ProjectMultiple, ProjectShort, ProjectSingle } from '@/api/data.types';
import { BASE_API_URL } from '@/consts';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type ProjectItem = ProjectMultiple & { is_favorite: boolean; is_archived: 0 | 1 };

export const projectsApi = createApi({
   reducerPath: 'projects',
   baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL, prepareHeaders }),
   endpoints: (builder) => ({
      getProjects: builder.query<{ data: Array<ProjectItem> }, void>({ query: () => '/project' }),
      getProject: builder.query<{ data: ProjectSingle }, string>({ query: (slug: string) => `/project/${slug}` }),

      updateProject: builder.mutation<{ message?: string }, { id: number; type: 'project'; setFavorite: boolean }>({
         // transformResponse: (response: { data: TaskMultiple }, meta, arg) => response.data,
         //
         query: (data) => ({ url: `/favorite`, method: data.setFavorite ? 'POST' : 'DELETE', body: data }),

         async onQueryStarted({ id, setFavorite }, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
               projectsApi.util.updateQueryData('getProjects', undefined, (draft) => {
                  const project = draft.data.find((p) => p.id === id);
                  if (project) project.is_favorite = setFavorite;
               })
            );
            try {
               await queryFulfilled;
            } catch {
               patchResult.undo();
            }
         },
      }),
   }),
});

export const { useGetProjectsQuery, useGetProjectQuery, useUpdateProjectMutation } = projectsApi;
