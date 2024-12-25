import { z } from 'zod'

export const projectsFilterFormSchema = z.object({
   projectName: z.string().optional(),
   taskId: z.number({ message: 'Номер задачи должен быть числом' })
      .min(1, { message: 'Номер задачи не может быть отрицательным числом' })
      .optional()
      .or(z.literal(''))
      // .transform(e => e === "" ? undefined : e)
})



