/**
 * Output Schema для FindIssuesTool
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
 * Схема критериев поиска
 */
const SearchCriteriaSchema = z.object({
  hasQuery: z.boolean().describe('Использован query параметр'),
  hasFilter: z.boolean().describe('Использован filter параметр'),
  keysCount: z.number().describe('Количество указанных ключей'),
  hasQueue: z.boolean().describe('Использована фильтрация по очереди'),
  perPage: z.number().describe('Записей на странице'),
});

/**
 * Output Schema для FindIssuesTool
 */
export const FindIssuesOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    count: z.number().describe('Количество найденных задач'),
    issues: z.array(IssueEntitySchema).describe('Найденные задачи'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
    searchCriteria: SearchCriteriaSchema.describe('Использованные критерии поиска'),
  }),
});
