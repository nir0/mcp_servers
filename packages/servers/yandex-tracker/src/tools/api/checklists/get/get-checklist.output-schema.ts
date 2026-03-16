/**
 * Output Schema для GetChecklistTool
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
 * Схема успешного результата для одной задачи
 */
const ChecklistSuccessItemSchema = z.object({
  issueId: z.string().describe('Идентификатор задачи'),
  itemsCount: z.number().describe('Количество элементов в чеклисте'),
  checklist: z.array(ChecklistItemEntitySchema).describe('Элементы чеклиста'),
});

/**
 * Схема ошибки для одной задачи
 */
const ChecklistErrorItemSchema = z.object({
  issueId: z.string().describe('Идентификатор задачи'),
  error: z.string().describe('Описание ошибки'),
});

/**
 * Output Schema для GetChecklistTool
 */
export const GetChecklistOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    successful: z.array(ChecklistSuccessItemSchema).describe('Чеклисты по задачам'),
    failed: z.array(ChecklistErrorItemSchema).describe('Ошибки по задачам'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
