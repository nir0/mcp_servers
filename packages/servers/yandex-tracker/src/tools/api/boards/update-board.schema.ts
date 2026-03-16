/**
 * Zod схема для валидации параметров UpdateBoardTool
 */

import { z } from 'zod';
import { FieldsSchema } from '#common/schemas/index.js';
import { BaseBoardFieldsSchema } from './base-board.schema.js';

/**
 * Схема параметров для обновления доски
 *
 * Использует базовую схему доски с:
 * - boardId: обязательно
 * - все остальные поля: опционально (через .partial())
 */
export const UpdateBoardParamsSchema = z
  .object({
    /**
     * ID доски для обновления (обязательно)
     */
    boardId: z.string().min(1, 'ID доски не может быть пустым'),

    /**
     * Версия доски (для оптимистичной блокировки)
     */
    version: z.number().int().optional(),

    /**
     * Список полей для возврата (обязательно)
     */
    fields: FieldsSchema,
  })
  .merge(BaseBoardFieldsSchema.partial());

/**
 * Вывод типа из схемы
 */
export type UpdateBoardParams = z.infer<typeof UpdateBoardParamsSchema>;
