/**
 * Output Schema для GetQueuesTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля Queue entity — optional, т.к. зависят от параметра `fields`.
 */

import { z } from 'zod';

/**
 * Схема UserRef (руководитель очереди и т.п.)
 */
const UserRefSchema = z.object({
  id: z.string().optional(),
  display: z.string().optional(),
  login: z.string().optional(),
});

/**
 * Схема справочника (тип задачи, приоритет)
 */
const DictionaryRefSchema = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема Queue entity (все поля optional — зависят от параметра fields)
 */
const QueueEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор очереди'),
  self: z.string().optional().describe('URL ссылка на очередь в API'),
  key: z.string().optional().describe('Ключ очереди (QUEUE)'),
  version: z.number().optional().describe('Версия очереди'),
  name: z.string().optional().describe('Название очереди'),
  lead: UserRefSchema.optional().describe('Руководитель очереди'),
  assignAuto: z.boolean().optional().describe('Автоназначение исполнителя'),
  defaultType: DictionaryRefSchema.optional().describe('Тип задачи по умолчанию'),
  defaultPriority: DictionaryRefSchema.optional().describe('Приоритет по умолчанию'),
  description: z.string().optional().describe('Описание очереди'),
  issueTypes: z.array(DictionaryRefSchema).optional().describe('Доступные типы задач'),
  denyVoting: z.boolean().optional().describe('Запрет голосования'),
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
 * Output Schema для GetQueuesTool
 */
export const GetQueuesOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    queues: z.array(QueueEntitySchema).describe('Список очередей'),
    count: z.number().describe('Количество очередей в результате'),
    page: z.number().describe('Текущая страница'),
    perPage: z.number().describe('Записей на странице'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
    grep: z.string().optional().describe('Использованный grep паттерн'),
    grepMeta: GrepMetaSchema.optional().describe('Метаданные grep фильтрации'),
  }),
});
