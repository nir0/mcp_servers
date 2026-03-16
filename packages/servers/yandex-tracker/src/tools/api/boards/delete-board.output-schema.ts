/**
 * Output Schema для DeleteBoardTool
 *
 * Описывает структуру ответа инструмента.
 * LLM агенты видят эту схему в tools/list и могут узнать
 * формат ответа при удалении доски.
 */

import { z } from 'zod';

/**
 * Output Schema для DeleteBoardTool
 */
export const DeleteBoardOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    message: z.string().describe('Сообщение об успешном удалении'),
    boardId: z.string().describe('Идентификатор удалённой доски'),
  }),
});
