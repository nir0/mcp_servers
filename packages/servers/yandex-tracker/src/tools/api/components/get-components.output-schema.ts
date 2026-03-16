/**
 * Output Schema для GetComponentsTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля Component — optional, т.к. зависят от параметра `fields`.
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
 * Схема Component entity (все поля optional — зависят от параметра fields)
 */
const ComponentEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор компонента'),
  self: z.string().optional().describe('URL ссылка на компонент в API'),
  name: z.string().optional().describe('Название компонента'),
  queue: QueueRefSchema.optional().describe('Очередь компонента'),
  assignAuto: z.boolean().optional().describe('Автоназначение исполнителя'),
  description: z.string().optional().describe('Описание компонента'),
  lead: UserRefSchema.optional().describe('Руководитель компонента'),
});

/**
 * Grep метаданные
 */
const GrepMetaSchema = z.object({
  fetchedTotal: z.number().describe('Всего получено записей'),
  matchedCount: z.number().describe('Совпало с grep паттерном'),
});

/**
 * Output Schema для GetComponentsTool
 */
export const GetComponentsOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    components: z.array(ComponentEntitySchema).describe('Список компонентов'),
    count: z.number().describe('Количество компонентов в результате'),
    queueId: z.string().describe('Идентификатор очереди'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
    grep: z.string().optional().describe('Использованный grep паттерн'),
    grepMeta: GrepMetaSchema.optional().describe('Метаданные grep фильтрации'),
  }),
});
