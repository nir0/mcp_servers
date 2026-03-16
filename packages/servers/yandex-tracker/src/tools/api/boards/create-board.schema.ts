/**
 * Zod схема для валидации параметров CreateBoardTool
 */

import { z } from 'zod';
import { FieldsSchema } from '#common/schemas/index.js';
import { BaseBoardFieldsSchema } from './base-board.schema.js';

/**
 * Схема параметров для создания доски
 *
 * Использует базовую схему доски с:
 * - name: обязательно (из базовой схемы)
 * - остальные поля: опционально (через .partial() + pick)
 */
export const CreateBoardParamsSchema = BaseBoardFieldsSchema.pick({ name: true })
  .merge(BaseBoardFieldsSchema.omit({ name: true }).partial())
  .merge(
    z.object({
      /**
       * Список полей для возврата (обязательно)
       */
      fields: FieldsSchema,
    })
  );

/**
 * Вывод типа из схемы
 */
export type CreateBoardParams = z.infer<typeof CreateBoardParamsSchema>;
