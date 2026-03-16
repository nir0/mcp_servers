/**
 * Output Schema для DeleteLinkTool
 *
 * Описывает структуру ответа инструмента.
 * DELETE операция не возвращает entity — только статус каждой операции.
 */

import { z } from 'zod';

/**
 * Схема успешного удаления связи
 */
const DeleteLinkSuccessSchema = z.object({
  issueId: z.string().describe('Ключ задачи'),
  linkId: z.string().describe('Идентификатор удалённой связи'),
  success: z.literal(true).describe('Статус удаления'),
});

/**
 * Схема ошибки удаления связи
 */
const DeleteLinkErrorSchema = z.object({
  issueId: z.string().describe('Ключ задачи'),
  linkId: z.string().describe('Идентификатор связи с ошибкой'),
  error: z.string().describe('Описание ошибки'),
});

/**
 * Output Schema для DeleteLinkTool
 */
export const DeleteLinkOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    total: z.number().describe('Общее количество запрошенных удалений'),
    successful: z.array(DeleteLinkSuccessSchema).describe('Успешно удалённые связи'),
    failed: z.array(DeleteLinkErrorSchema).describe('Связи с ошибками удаления'),
  }),
});
