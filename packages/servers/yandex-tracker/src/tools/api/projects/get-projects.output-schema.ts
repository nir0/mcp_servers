/**
 * Output Schema для GetProjectsTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля Project — optional, т.к. зависят от параметра `fields`.
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
 * Схема QueueRef
 */
const QueueRefSchema = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема Project entity (все поля optional — зависят от параметра fields)
 */
const ProjectEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор проекта'),
  self: z.string().optional().describe('URL ссылка на проект в API'),
  key: z.string().optional().describe('Ключ проекта'),
  name: z.string().optional().describe('Название проекта'),
  lead: UserRefSchema.optional().describe('Руководитель проекта'),
  status: z.string().optional().describe('Статус проекта'),
  description: z.string().optional().describe('Описание проекта'),
  teamUsers: z.array(UserRefSchema).optional().describe('Участники проекта'),
  startDate: z.string().optional().describe('Дата начала (ISO 8601)'),
  endDate: z.string().optional().describe('Дата окончания (ISO 8601)'),
  queues: z.array(QueueRefSchema).optional().describe('Связанные очереди'),
});

/**
 * Grep метаданные (для paginated endpoints)
 */
const GrepMetaSchema = z.object({
  fetchedTotal: z.number().describe('Всего получено записей на текущей странице'),
  matchedCount: z.number().describe('Совпало с grep паттерном'),
  page: z.number().describe('Текущая страница'),
  perPage: z.number().describe('Записей на странице'),
});

/**
 * Output Schema для GetProjectsTool
 */
export const GetProjectsOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    projects: z.array(ProjectEntitySchema).describe('Список проектов'),
    total: z.number().describe('Общее количество проектов'),
    count: z.number().describe('Количество проектов в результате'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
    grep: z.string().optional().describe('Использованный grep паттерн'),
    grepMeta: GrepMetaSchema.optional().describe('Метаданные grep фильтрации'),
  }),
});
