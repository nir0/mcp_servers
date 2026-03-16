/**
 * Output Schema для CreateLinkTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля Link entity — optional, т.к. зависят от параметра `fields`.
 */

import { z } from 'zod';

/**
 * Схема UserRef (автор связи)
 */
const UserRefSchema = z.object({
  self: z.string().optional(),
  id: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема типа связи
 */
const LinkTypeSchema = z.object({
  id: z.string().optional(),
  inward: z.string().optional(),
  outward: z.string().optional(),
});

/**
 * Схема связанной задачи (object)
 */
const LinkedObjectSchema = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема Link entity (все поля optional — зависят от параметра fields)
 */
const LinkEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор связи'),
  self: z.string().optional().describe('URL связи в API'),
  type: LinkTypeSchema.optional().describe('Тип связи'),
  direction: z.enum(['inward', 'outward']).optional().describe('Направление связи'),
  object: LinkedObjectSchema.optional().describe('Связанная задача'),
  createdBy: UserRefSchema.optional().describe('Автор связи'),
  createdAt: z.string().optional().describe('Дата создания (ISO 8601)'),
  updatedBy: UserRefSchema.optional().describe('Кто обновил связь'),
  updatedAt: z.string().optional().describe('Дата обновления (ISO 8601)'),
});

/**
 * Схема успешного результата для batch-операции
 */
const BatchCreateLinkSuccessSchema = z.object({
  issueId: z.string().describe('Ключ задачи'),
  linkId: z.string().optional().describe('Идентификатор созданной связи'),
  link: LinkEntitySchema.describe('Данные созданной связи'),
});

/**
 * Схема ошибки для batch-операции
 */
const BatchErrorSchema = z.object({
  issueId: z.string().describe('Ключ задачи с ошибкой'),
  error: z.string().describe('Описание ошибки'),
});

/**
 * Output Schema для CreateLinkTool
 */
export const CreateLinkOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    total: z.number().describe('Общее количество запрошенных связей'),
    successful: z.number().describe('Количество успешно созданных'),
    failed: z.number().describe('Количество с ошибками'),
    links: z.array(BatchCreateLinkSuccessSchema).describe('Успешно созданные связи'),
    errors: z.array(BatchErrorSchema).describe('Связи с ошибками'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
