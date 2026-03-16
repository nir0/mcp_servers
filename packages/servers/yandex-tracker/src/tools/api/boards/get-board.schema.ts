/**
 * Zod схема для валидации параметров GetBoardTool
 */

import { z } from 'zod';
import { FieldsSchema } from '#common/schemas/index.js';

/**
 * Схема параметров для получения одной доски
 */
export const GetBoardParamsSchema = z.object({
  /**
   * ID доски (обязательно)
   */
  boardId: z.string().min(1, 'ID доски не может быть пустым'),

  /**
   * Список полей для возврата (обязательно)
   */
  fields: FieldsSchema,
});

/**
 * Вывод типа из схемы
 */
export type GetBoardParams = z.infer<typeof GetBoardParamsSchema>;
