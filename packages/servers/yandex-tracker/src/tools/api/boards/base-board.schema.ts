/**
 * Базовая Zod схема для досок (переиспользуется в Create и Update)
 */

import { z } from 'zod';

/**
 * Схема колонки доски
 */
export const BoardColumnSchema = z.object({
  /**
   * Название колонки
   */
  name: z.string().min(1, 'Название колонки не может быть пустым'),

  /**
   * Массив ключей статусов для этой колонки
   */
  statuses: z.array(z.string().min(1)).min(1, 'Колонка должна содержать хотя бы один статус'),
});

/**
 * Схема фильтра доски
 */
export const BoardFilterSchema = z.object({
  /**
   * Query string для фильтрации задач на доске
   */
  query: z.string().optional(),
});

/**
 * Базовые поля доски (без ID)
 */
export const BaseBoardFieldsSchema = z.object({
  /**
   * Название доски
   */
  name: z.string().min(1, 'Название доски не может быть пустым'),

  /**
   * ID очереди, для которой создается доска
   */
  queue: z.string().optional(),

  /**
   * Колонки доски
   */
  columns: z.array(BoardColumnSchema).optional(),

  /**
   * Фильтр доски
   */
  filter: BoardFilterSchema.optional(),

  /**
   * Поле для сортировки задач
   */
  orderBy: z.string().optional(),

  /**
   * Порядок сортировки: true = возрастание, false = убывание
   */
  orderAsc: z.boolean().optional(),

  /**
   * Query string для дополнительной фильтрации
   */
  query: z.string().optional(),

  /**
   * Использовать ранжирование задач
   */
  useRanking: z.boolean().optional(),

  /**
   * ID страны для региональных настроек
   */
  country: z.string().optional(),
});
