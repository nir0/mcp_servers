/**
 * Output Schema для GetQueueTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля Queue — optional, т.к. зависят от параметра `fields`.
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
 * Output Schema для GetQueueTool
 */
export const GetQueueOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    queue: QueueEntitySchema.describe('Очередь'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
