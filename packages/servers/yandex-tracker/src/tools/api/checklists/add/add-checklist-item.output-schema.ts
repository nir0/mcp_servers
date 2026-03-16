/**
 * Output Schema для AddChecklistItemTool
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
const AddChecklistSuccessItemSchema = z.object({
  issueId: z.string().describe('Идентификатор задачи'),
  itemId: z.string().optional().describe('Идентификатор созданного элемента'),
  item: ChecklistItemEntitySchema.describe('Созданный элемент чеклиста'),
});

/**
 * Схема ошибки для одного элемента
 */
const AddChecklistErrorItemSchema = z.object({
  issueId: z.string().describe('Идентификатор задачи'),
  error: z.string().describe('Описание ошибки'),
});

/**
 * Output Schema для AddChecklistItemTool
 */
export const AddChecklistItemOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    total: z.number().describe('Общее количество запрошенных операций'),
    successful: z.number().describe('Количество успешных операций'),
    failed: z.number().describe('Количество неуспешных операций'),
    items: z.array(AddChecklistSuccessItemSchema).describe('Добавленные элементы'),
    errors: z.array(AddChecklistErrorItemSchema).describe('Ошибки добавления'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
