/**
 * Output Schema для DeleteComponentTool
 *
 * Описывает структуру ответа инструмента.
 */

import { z } from 'zod';

/**
 * Output Schema для DeleteComponentTool
 */
export const DeleteComponentOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    success: z.boolean().describe('Признак успешного удаления'),
    componentId: z.string().describe('Идентификатор удалённого компонента'),
    message: z.string().describe('Сообщение о результате'),
  }),
});
