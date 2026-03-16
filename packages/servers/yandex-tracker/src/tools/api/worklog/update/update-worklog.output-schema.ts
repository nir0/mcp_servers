/**
 * Output Schema для UpdateWorklogTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля Worklog — optional, т.к. зависят от параметра `fields`.
 */

import { z } from 'zod';

/**
 * Схема UserRef
 */
const UserRefSchema = z.object({
  id: z.string().optional(),
  display: z.string().optional(),
  login: z.string().optional(),
});

/**
 * Схема IssueRef
 */
const IssueRefSchema = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема Worklog entity (все поля optional — зависят от параметра fields)
 */
const WorklogEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор записи времени'),
  self: z.string().optional().describe('URL ссылка в API'),
  issue: IssueRefSchema.optional().describe('Задача'),
  comment: z.string().optional().describe('Комментарий'),
  createdBy: UserRefSchema.optional().describe('Автор записи'),
  updatedBy: UserRefSchema.optional().describe('Кто обновил запись'),
  createdAt: z.string().optional().describe('Дата создания (ISO 8601)'),
  updatedAt: z.string().optional().describe('Дата обновления (ISO 8601)'),
  start: z.string().optional().describe('Начало работы (ISO 8601)'),
  duration: z.string().optional().describe('Продолжительность (ISO 8601 Duration)'),
});

/**
 * Output Schema для UpdateWorklogTool
 */
export const UpdateWorklogOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    data: WorklogEntitySchema.describe('Обновлённая запись времени'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
