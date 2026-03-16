/**
 * Zod схема для валидации параметров GetBoardsTool
 */

import { z } from 'zod';
import { FieldsSchema, GrepSchema } from '#common/schemas/index.js';

/**
 * Схема параметров для получения списка досок
 */
export const GetBoardsParamsSchema = z.object({
  /**
   * Список полей для возврата (обязательно)
   */
  fields: FieldsSchema,

  /**
   * Regex для фильтрации досок по значениям атрибутов (опционально)
   */
  grep: GrepSchema,
});

/**
 * Вывод типа из схемы
 */
export type GetBoardsParams = z.infer<typeof GetBoardsParamsSchema>;
