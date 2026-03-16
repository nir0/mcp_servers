/**
 * Output Schema для DeleteAttachmentTool
 *
 * Описывает структуру ответа инструмента.
 */

import { z } from 'zod';

/**
 * Output Schema для DeleteAttachmentTool
 */
export const DeleteAttachmentOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    issueId: z.string().describe('Ключ задачи'),
    attachmentId: z.string().describe('Идентификатор удалённого файла'),
    deleted: z.boolean().describe('Признак успешного удаления'),
    message: z.string().describe('Сообщение о результате'),
  }),
});
