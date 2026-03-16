/**
 * Output Schema для DeleteCommentTool
 *
 * Описывает структуру ответа инструмента.
 * DELETE операция не возвращает данные комментария.
 */

import { z } from 'zod';

/**
 * Схема успешного результата для одного удалённого комментария
 */
const DeleteCommentSuccessItemSchema = z.object({
  issueId: z.string().describe('Идентификатор задачи'),
  commentId: z.string().optional().describe('Идентификатор удалённого комментария'),
  success: z.boolean().describe('Статус удаления'),
});

/**
 * Схема ошибки для одного комментария
 */
const DeleteCommentErrorItemSchema = z.object({
  issueId: z.string().describe('Идентификатор задачи'),
  commentId: z.string().optional().describe('Идентификатор комментария'),
  error: z.string().describe('Описание ошибки'),
});

/**
 * Output Schema для DeleteCommentTool
 */
export const DeleteCommentOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    total: z.number().describe('Общее количество запрошенных операций'),
    successful: z.array(DeleteCommentSuccessItemSchema).describe('Удалённые комментарии'),
    failed: z.array(DeleteCommentErrorItemSchema).describe('Ошибки удаления'),
  }),
});
