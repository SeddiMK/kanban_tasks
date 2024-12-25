import { useGetCurrentUserQuery } from "@/api/appApi";
import { Stage, TaskMultiple, User } from "@/api/data.types";
import { useGetAllTasksQuery, useGetTaskTypesQuery } from "@/api/tasks/tasks.api";
import { useGetProjectQuery } from "@/modules/ProjectsPage/api/api";
import { groupByObject } from "@/utils/core";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { z } from "zod";
import { tasksFilterFormSchema } from "../utils/validationSchema";
import { ProjectSingle } from '../../../api/data.types';


type FormSchema = z.infer<typeof tasksFilterFormSchema>;

let cachedData: {
   tasks: TaskMultiple[],
   stagedTasks: Record<string, [(Record<PropertyKey, unknown> & TaskMultiple)[], Required<Stage>]>,
   project: ProjectSingle | null,
   user: User | null,
   showJustMine: Dispatch<SetStateAction<boolean>>,
   tasksRefetch: Function,
   isLoading: boolean,
   isSuccess: boolean
};

/**
 * 
 * @param route - current route (to get project slug)
 * @param user - current user data
 * @param justMine  
 * @returns - staged tasks
 */
export function useStagedTasks(route: string, filter: FormSchema, skip?: boolean) {

   const [justMine, setJustMine] = useState(false);
   const { data: { data: user } = { data: null } } = useGetCurrentUserQuery();

   const { data: { data: tasktypesInfo } = { data: [] } } = useGetTaskTypesQuery(undefined);

   const loaded = useMemo(() => ({ skip: !route }), [route]);

   // const { data: { data: priorities } = { data: null } } = useGetTaskPrioritiesQuery(undefined, loaded);
   const { data: { data: project } = { data: null }, error } = useGetProjectQuery(route, loaded);

   const {
      data: { data: tasks } = { data: [] },
      isLoading,
      isSuccess,
      isError,
      refetch,
   } = useGetAllTasksQuery({
      slug: route,
      taskFilter: {
         name: filter.taskName,
         user_id: filter.selectedUsers?.map(u => u.id),
         type_id: filter.selectedTypes?.map(tp => tp.id) as number[],
         date_start_from: filter.dateStart?.startDate ? new Date(filter.dateStart?.startDate).toLocaleDateString('ru') : null,
         date_start_to: filter.dateStart?.endDate ? new Date(filter.dateStart?.endDate).toLocaleDateString('ru') : null,
         date_end_from: filter.dateEnd?.startDate ? new Date(filter.dateEnd?.startDate).toLocaleDateString('ru') : null,
         date_end_to: filter.dateEnd?.endDate ? new Date(filter.dateEnd?.endDate).toLocaleDateString('ru') : null
      }
   }, { skip: !route || !(project) || skip }); //  || !taskStages?.length


   const stagedTasks = useMemo(() => {
      const grouped = groupByObject(
         project?.flow?.possibleProjectStages as Required<Stage>[],
         tasks as (Record<PropertyKey, unknown> & TaskMultiple)[],
         'stage',
         (item) => {

            if (justMine && item.created_by !== user?.id) {
               return false;
            }
            if (filter?.selectedTags?.length) {
               if (!filter.selectedTags.some(v => v.id === item.component)) {
                  return false;
               }
            }
            if (!tasktypesInfo[item.task_type as number]) {
               // tasktypesInfo;
               // debugger
               return false;
            }
            return true;
         }
      );
      return grouped;
   }, [tasks, project?.flow?.possibleProjectStages, justMine, filter]);

   const result = { tasks, stagedTasks, project, user, tasksRefetch: refetch, showJustMine: setJustMine, isLoading, isSuccess, isError };

   // cachedData = result;

   return result;
}