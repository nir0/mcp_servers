/**
 * Output Schema для GetIssueChangelogTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля ChangelogEntry entity — optional, т.к. зависят от параметра `fields`.
 */

import { z } from 'zod';

/**
 * Схема User entity (автор изменения)
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
 * Схема изменённого поля
 */
const ChangelogFieldSchema = z.object({
  field: z
    .object({
      id: z.string().optional(),
      display: z.string().optional(),
    })
    .optional(),
  from: z.unknown().optional(),
  to: z.unknown().optional(),
});

/**
 * Схема ссылки на задачу в changelog
 */
const IssueRefSchema = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема ChangelogEntry entity (все поля optional — зависят от параметра fields)
 */
const ChangelogEntrySchema = z.object({
  id: z.string().optional().describe('Идентификатор записи'),
  self: z.string().optional().describe('URL записи'),
  issue: IssueRefSchema.optional().describe('Задача, к которой относится изменение'),
  updatedAt: z.string().optional().describe('Дата и время изменения (ISO 8601)'),
  updatedBy: UserSchema.optional().describe('Пользователь, внёсший изменение'),
  type: z.string().optional().describe('Тип изменения (IssueUpdated, IssueCreated и т.д.)'),
  transport: z.string().optional().describe('Способ внесения изменения (web, api и т.д.)'),
  fields: z.array(ChangelogFieldSchema).optional().describe('Список изменённых полей'),
  attachments: z.array(z.unknown()).optional().describe('Вложения'),
  comments: z.array(z.unknown()).optional().describe('Комментарии'),
  worklog: z.array(z.unknown()).optional().describe('Worklog записи'),
  messages: z.array(z.unknown()).optional().describe('Сообщения'),
  links: z.array(z.unknown()).optional().describe('Связи задач'),
  ranks: z.array(z.unknown()).optional().describe('Ранги'),
});

/**
 * Схема успешного результата для batch-операции
 */
const BatchChangelogSuccessSchema = z.object({
  issueKey: z.string().describe('Ключ задачи'),
  changelog: z.array(ChangelogEntrySchema).describe('История изменений'),
  totalEntries: z.number().describe('Количество записей в истории'),
});

/**
 * Схема ошибки для batch-операции
 */
const BatchErrorSchema = z.object({
  key: z.string().describe('Ключ задачи с ошибкой'),
  error: z.string().describe('Описание ошибки'),
});

/**
 * Output Schema для GetIssueChangelogTool
 */
export const GetIssueChangelogOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    total: z.number().describe('Общее количество запрошенных задач'),
    successful: z.array(BatchChangelogSuccessSchema).describe('Успешно полученные истории'),
    failed: z.array(BatchErrorSchema).describe('Задачи с ошибками'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
