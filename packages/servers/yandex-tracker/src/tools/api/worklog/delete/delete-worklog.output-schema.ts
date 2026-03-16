/**
 * Output Schema для DeleteWorklogTool
 *
 * Описывает структуру ответа инструмента.
 */

import { z } from 'zod';

/**
 * Output Schema для DeleteWorklogTool
 */
export const DeleteWorklogOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    issueId: z.string().describe('Ключ задачи'),
    worklogId: z.string().describe('Идентификатор удалённой записи времени'),
    message: z.string().describe('Сообщение о результате'),
  }),
});
