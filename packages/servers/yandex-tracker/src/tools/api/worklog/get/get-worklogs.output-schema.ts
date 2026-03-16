/**
 * Output Schema для GetWorklogsTool
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
 * Output Schema для GetWorklogsTool
 */
export const GetWorklogsOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    total: z.number().describe('Общее количество запрошенных задач'),
    successful: z.number().describe('Количество успешных'),
    failed: z.number().describe('Количество с ошибками'),
    worklogs: z
      .array(
        z.object({
          issueId: z.string().describe('Ключ задачи'),
          worklogs: z.array(WorklogEntitySchema).describe('Записи времени'),
          count: z.number().describe('Количество записей'),
        })
      )
      .describe('Записи времени по задачам'),
    errors: z
      .array(
        z.object({
          issueId: z.string().describe('Ключ задачи'),
          error: z.string().describe('Описание ошибки'),
        })
      )
      .describe('Задачи с ошибками'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
