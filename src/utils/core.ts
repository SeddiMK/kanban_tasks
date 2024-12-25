/**
 * @example: 
 * 
 * @param xs - [{task_type: 2}, {task_type: 2}, {task_type: 1}, ...]
 * @param key - task_type
 * @returns [[{task_type: 2}, {task_type: 2}], [{task_type: 1}]]
 */
export function groupBy<T extends PropertyKey>(xs: Array<{ [k in T]?: PropertyKey } & Record<PropertyKey, unknown>>, key: T) {

   type GroupedType = { [k in T]?: PropertyKey } & Record<PropertyKey, unknown>;

   return Object.entries(
      xs.reduce(function (acc, item) {
         const v = item[key] as PropertyKey;

         (acc[v] = acc[v] || [] as GroupedType[]).push(item);

         return acc;
      }, {} as Record<PropertyKey, GroupedType[]>)
   );
};


export function groupByObject<T extends PropertyKey, GroupingType extends { [k in T]?: PropertyKey }, CompositeType extends { id: string | number }>(
   tarArr: Array<CompositeType>,
   arr: Array<GroupingType>,
   key: T,
   filter?: (item: GroupingType) => boolean
) {

   if (!tarArr?.length) return [] as unknown as Record<string, [GroupingType[], CompositeType]>;

   // type GroupedType = { [k in T]?: PropertyKey } & Record<PropertyKey, unknown>;

   const entries = Object.entries(
      arr.reduce(function (acc, item) {
         const v = item[key] as PropertyKey;
         
         if (filter) {
            if (filter(item)) (acc[v] = acc[v] || [] as GroupingType[]).push(item);
         }
         else {
            (acc[v] = acc[v] || [] as GroupingType[]).push(item);
         }

         return acc;
      }, {} as Record<PropertyKey, GroupingType[]>)
   )

   entries.map(v => {
      const numberId = Number.parseInt(v[0]);
      if (numberId) {
         // debugger
         (v as unknown[]).push(tarArr?.find(s => s.id === numberId))
      }
      else {
         // 
      }
   })

   const result = entries.reduce((acc, v) => {
      acc[v.shift() as unknown as string] = v as unknown as [GroupingType[], typeof tarArr[number]];
      return acc;
   }, {} as Record<string, [GroupingType[], typeof tarArr[number]]>)

   return result as Record<string, [GroupingType[], CompositeType]>;
   // return entries as unknown as [string, GroupedType[], typeof tarArr[number]][];
};
