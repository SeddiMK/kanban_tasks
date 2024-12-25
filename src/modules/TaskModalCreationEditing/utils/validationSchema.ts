import * as z from 'zod';

// схема валидации Zod
export const formSchema = z.object({
   name: z.string().min(3, 'Ошибка'),
   selectedOptionTasks: z
      .object({
         id: z.number().optional(),
         name: z.string().optional(),
      })
      .refine((value) => value.id !== 0 && value.name !== '', {
         message: 'Тип задачи обязателен',
      }),
   selectedOptionComp: z
      .object({
         id: z.number().optional(),
         name: z.string().optional(),
         color: z.string().optional(),
      })
      .refine((value) => value.id !== 0 && value.name !== '', {
         message: 'Компонент обязателен',
      }),
   selectedOptionsCheckbox: z
      .array(
         z.object({
            id: z.number(),
            name: z.string(),
            surname: z.string(),
            email: z.string(),
         })
      )
      .min(1, 'Выберите хотя бы одного исполнителя'),
   selectedOptionPriority: z
      .object({
         id: z.number().optional(),
         name: z.string().optional(),
      })
      .refine((value) => value.id !== 0 && value.name !== '', {
         message: 'Приоритет обязателен',
      }),
   estimateMinutes: z
      .string()
      .refine((value) => value === '' || /^\d+$/.test(value), {
         message: 'Оценка должна быть числом',
      })
      .transform((value) => (value === '' ? undefined : parseInt(value, 10)))
      .optional(),

   estimate: z.string().optional(),
   date: z
      .object({
         startDate: z
            .string()
            .optional()
            .nullable()
            .transform((value) => (value ? new Date(value).toISOString() : null)),
         endDate: z
            .string()
            .optional()
            .nullable()
            .transform((value) => (value ? new Date(value).toISOString() : null)),
      })
      .refine(
         (value) => {
            const bothDatesEmpty = !value.startDate && !value.endDate;
            const bothDatesPresent = value.startDate && value.endDate;
            return bothDatesEmpty || bothDatesPresent;
         },
         {
            message: 'Заполните обе даты или оставьте их пустыми',
         }
      ),
   description: z.string().min(10, 'Описание должно содержать не менее 10 символов'),
   fileLinks: z
      .array(
         z.object({
            id: z.number().optional(),
            created_at: z.string(),
            updated_at: z.string(),
            original_name: z.string(),
            link: z.string().optional(),
            fileObject: z.instanceof(File).optional(),
         })
      )
      .optional(),
   layoutLink: z.string().optional(),

   markupLink: z
      .string()

      .optional(),

   devLink: z
      .string()

      .optional(),
});
