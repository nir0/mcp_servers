/**
 * Output Schema для GetIssueLinksTool
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
const BatchLinksSuccessSchema = z.object({
  issueId: z.string().describe('Ключ задачи'),
  links: z.array(LinkEntitySchema).describe('Связи задачи'),
  count: z.number().describe('Количество связей'),
});

/**
 * Схема ошибки для batch-операции
 */
const BatchErrorSchema = z.object({
  issueId: z.string().describe('Ключ задачи с ошибкой'),
  error: z.string().describe('Описание ошибки'),
});

/**
 * Output Schema для GetIssueLinksTool
 */
export const GetIssueLinksOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    total: z.number().describe('Общее количество запрошенных задач'),
    successful: z.array(BatchLinksSuccessSchema).describe('Успешно полученные связи'),
    failed: z.array(BatchErrorSchema).describe('Задачи с ошибками'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
