import { configureStore } from '@reduxjs/toolkit';
import { projectsApi } from '@/modules/ProjectsPage/api/api';
import { taskApiActions } from '@/modules/TaskModalCreationEditing/api/taskApiActions';
import { tasksApi } from '@/api/tasks/tasks.api';
import { userApi } from '@/api/user/user.api';
import { appApi } from '@/api/appApi';

// import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
   reducer: {
      [userApi.reducerPath]: userApi.reducer,
      [projectsApi.reducerPath]: projectsApi.reducer,
      [appApi.reducerPath]: appApi.reducer,
      [taskApiActions.reducerPath]: taskApiActions.reducer,
      [tasksApi.reducerPath]: tasksApi.reducer,
      tasks: tasksApi.reducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
         .concat(userApi.middleware)
         .concat(projectsApi.middleware)
         .concat(tasksApi.middleware)
         .concat(appApi.middleware)
         .concat(taskApiActions.middleware),
});

// setupListeners(store.dispatch);
export type TypeRootState = ReturnType<typeof store.getState>;
