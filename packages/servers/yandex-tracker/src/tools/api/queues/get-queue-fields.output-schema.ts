/**
 * Output Schema для GetQueueFieldsTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля QueueField — optional, т.к. зависят от параметра `fields`.
 */

import { z } from 'zod';

/**
 * Схема категории поля
 */
const FieldCategorySchema = z.object({
  id: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема QueueField entity (все поля optional — зависят от параметра fields)
 */
const QueueFieldEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор поля'),
  key: z.string().optional().describe('Ключ поля'),
  name: z.string().optional().describe('Название поля'),
  required: z.boolean().optional().describe('Обязательное поле'),
  type: z.string().optional().describe('Тип поля'),
  category: FieldCategorySchema.optional().describe('Категория поля'),
});

/**
 * Output Schema для GetQueueFieldsTool
 */
export const GetQueueFieldsOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    fields: z.array(QueueFieldEntitySchema).describe('Список полей очереди'),
    count: z.number().describe('Количество полей'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
