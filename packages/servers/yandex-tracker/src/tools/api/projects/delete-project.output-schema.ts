/**
 * Output Schema для DeleteProjectTool
 *
 * Описывает структуру ответа инструмента.
 */

import { z } from 'zod';

/**
 * Output Schema для DeleteProjectTool
 */
export const DeleteProjectOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    message: z.string().describe('Сообщение о результате'),
    projectId: z.string().describe('Идентификатор удалённого проекта'),
  }),
});
