/**
 * Output Schema для DownloadAttachmentTool
 *
 * Описывает структуру ответа инструмента.
 * Ответ содержит либо base64, либо путь к сохранённому файлу.
 */

import { z } from 'zod';

/**
 * Output Schema для DownloadAttachmentTool
 */
export const DownloadAttachmentOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    issueId: z.string().describe('Ключ задачи'),
    attachmentId: z.string().describe('Идентификатор файла'),
    filename: z.string().describe('Имя файла'),
    size: z.number().describe('Размер файла в байтах'),
    mimetype: z.string().describe('MIME тип файла'),
    savedTo: z.string().optional().describe('Путь к сохранённому файлу (если указан saveToPath)'),
    base64: z.string().optional().describe('Содержимое файла в base64 (если не указан saveToPath)'),
  }),
});
