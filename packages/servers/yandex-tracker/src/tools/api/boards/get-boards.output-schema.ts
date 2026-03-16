/**
 * Output Schema для GetBoardsTool
 *
 * Описывает структуру ответа инструмента.
 * LLM агенты видят эту схему в tools/list и могут узнать
 * доступные поля Board entity и их типы.
 *
 * Все поля Board — optional, т.к. зависят от параметра `fields`.
 */

import { z } from 'zod';

/**
 * Схема статуса колонки доски
 */
const BoardColumnStatusSchema = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема колонки доски
 */
const BoardColumnSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  statuses: z.array(BoardColumnStatusSchema).optional(),
});

/**
 * Схема фильтра доски
 */
const BoardFilterSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  query: z.string().optional(),
});

/**
 * Схема Board entity (все поля optional — зависят от параметра fields)
 */
const BoardEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор доски'),
  self: z.string().optional().describe('URL ссылка на доску в API'),
  version: z.number().optional().describe('Версия доски'),
  name: z.string().optional().describe('Название доски'),
  columns: z.array(BoardColumnSchema).optional().describe('Колонки доски'),
  filter: BoardFilterSchema.optional().describe('Фильтр доски'),
  orderBy: z.string().optional().describe('Поле сортировки'),
  orderAsc: z.boolean().optional().describe('Порядок сортировки'),
  query: z.string().optional().describe('Query для фильтрации задач'),
  useRanking: z.boolean().optional().describe('Использовать ранжирование'),
});

/**
 * Grep метаданные
 */
const GrepMetaSchema = z.object({
  fetchedTotal: z.number().describe('Всего получено записей'),
  matchedCount: z.number().describe('Совпало с grep паттерном'),
});

/**
 * Output Schema для GetBoardsTool
 */
export const GetBoardsOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    boards: z.array(BoardEntitySchema).describe('Список досок'),
    total: z.number().describe('Количество досок в результате'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
    grep: z.string().optional().describe('Использованный grep паттерн'),
    grepMeta: GrepMetaSchema.optional().describe('Метаданные grep фильтрации'),
  }),
});
