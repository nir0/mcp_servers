/**
 * Output Schema для UpdateChecklistItemTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля ChecklistItem entity — optional, т.к. зависят от параметра `fields`.
 */

import { z } from 'zod';

/**
 * Схема UserRef (назначенное лицо)
 */
const UserRefSchema = z.object({
  self: z.string().optional(),
  id: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема ChecklistItem entity (все поля optional — зависят от параметра fields)
 */
const ChecklistItemEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор элемента чеклиста'),
  text: z.string().optional().describe('Текст элемента чеклиста'),
  checked: z.boolean().optional().describe('Статус выполнения элемента'),
  assignee: UserRefSchema.optional().describe('Назначенное лицо'),
  deadline: z.string().optional().describe('Дедлайн в формате ISO 8601'),
});

/**
 * Схема успешного результата для одного элемента
 */
const UpdateChecklistSuccessItemSchema = z.object({
  issueId: z.string().describe('Идентификатор задачи'),
  checklistItemId: z.string().optional().describe('Идентификатор обновлённого элемента'),
  item: ChecklistItemEntitySchema.describe('Обновлённый элемент чеклиста'),
});

/**
 * Схема ошибки для одного элемента
 */
const UpdateChecklistErrorItemSchema = z.object({
  issueId: z.string().describe('Идентификатор задачи'),
  checklistItemId: z.string().optional().describe('Идентификатор элемента'),
  error: z.string().describe('Описание ошибки'),
});

/**
 * Output Schema для UpdateChecklistItemTool
 */
export const UpdateChecklistItemOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    total: z.number().describe('Общее количество запрошенных операций'),
    successful: z.number().describe('Количество успешных операций'),
    failed: z.number().describe('Количество неуспешных операций'),
    items: z.array(UpdateChecklistSuccessItemSchema).describe('Обновлённые элементы'),
    errors: z.array(UpdateChecklistErrorItemSchema).describe('Ошибки обновления'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
