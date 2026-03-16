/**
 * Output Schema для GetThumbnailTool
 *
 * Описывает структуру ответа инструмента.
 * Ответ содержит либо base64, либо путь к сохранённому файлу.
 */

import { z } from 'zod';

/**
 * Output Schema для GetThumbnailTool
 */
export const GetThumbnailOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    issueId: z.string().describe('Ключ задачи'),
    attachmentId: z.string().describe('Идентификатор файла'),
    size: z.number().describe('Размер миниатюры в байтах'),
    mimetype: z.string().describe('MIME тип миниатюры'),
    savedTo: z.string().optional().describe('Путь к сохранённому файлу (если указан saveToPath)'),
    base64: z
      .string()
      .optional()
      .describe('Содержимое миниатюры в base64 (если не указан saveToPath)'),
  }),
});
