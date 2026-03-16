/**
 * Output Schema для TransitionIssueTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля Issue entity — optional, т.к. зависят от параметра `fields`.
 */

import { z } from 'zod';

/**
 * Схема User entity (автор, исполнитель)
 */
const UserSchema = z.object({
  uid: z.string().optional(),
  display: z.string().optional(),
  login: z.string().optional(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isActive: z.boolean().optional(),
});

/**
 * Схема справочника (статус, приоритет, тип)
 */
const DictionaryRefSchema = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема Queue (очередь задачи)
 */
const QueueRefSchema = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  self: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема Issue entity (все поля optional — зависят от параметра fields)
 */
const IssueEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор задачи'),
  key: z.string().optional().describe('Ключ задачи (QUEUE-123)'),
  summary: z.string().optional().describe('Краткое описание задачи'),
  queue: QueueRefSchema.optional().describe('Очередь задачи'),
  status: DictionaryRefSchema.optional().describe('Статус задачи'),
  createdBy: UserSchema.optional().describe('Автор задачи'),
  createdAt: z.string().optional().describe('Дата создания (ISO 8601)'),
  updatedAt: z.string().optional().describe('Дата обновления (ISO 8601)'),
  description: z.string().optional().describe('Подробное описание задачи'),
  assignee: UserSchema.optional().describe('Исполнитель задачи'),
  priority: DictionaryRefSchema.optional().describe('Приоритет задачи'),
  type: DictionaryRefSchema.optional().describe('Тип задачи'),
});

/**
 * Output Schema для TransitionIssueTool
 */
export const TransitionIssueOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    issueKey: z.string().describe('Ключ задачи'),
    transitionId: z.string().describe('Идентификатор выполненного перехода'),
    issue: IssueEntitySchema.describe('Данные задачи после перехода'),
    fieldsReturned: z
      .union([z.array(z.string()), z.literal('all')])
      .describe('Возвращённые поля или "all"'),
  }),
});
