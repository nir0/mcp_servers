/**
 * Zod схема для валидации параметров DeleteBoardTool
 */

import { z } from 'zod';

/**
 * Схема параметров для удаления доски
 */
export const DeleteBoardParamsSchema = z.object({
  /**
   * ID доски для удаления (обязательно)
   */
  boardId: z.string().min(1, 'ID доски не может быть пустым'),
});

/**
 * Вывод типа из схемы
 */
export type DeleteBoardParams = z.infer<typeof DeleteBoardParamsSchema>;
