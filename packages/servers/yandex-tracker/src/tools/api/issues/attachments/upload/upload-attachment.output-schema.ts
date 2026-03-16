/**
 * Output Schema для UploadAttachmentTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля Attachment — optional, т.к. зависят от параметра `fields`.
 */

import { z } from 'zod';

/**
 * Схема UserRef
 */
const UserRefSchema = z.object({
  id: z.string().optional(),
  display: z.string().optional(),
  login: z.string().optional(),
});

/**
 * Схема Attachment entity (все поля optional — зависят от параметра fields)
 */
const AttachmentEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор файла'),
  self: z.string().optional().describe('URL ссылка на файл в API'),
  name: z.string().optional().describe('Имя файла'),
  content: z.string().optional().describe('URL для скачивания файла'),
  thumbnail: z.string().optional().describe('URL миниатюры изображения'),
  createdBy: UserRefSchema.optional().describe('Автор загрузки файла'),
  createdAt: z.string().optional().describe('Дата создания (ISO 8601)'),
  mimetype: z.string().optional().describe('MIME тип файла'),
  size: z.number().optional().describe('Размер файла в байтах'),
});

/**
 * Output Schema для UploadAttachmentTool
 */
export const UploadAttachmentOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    issueId: z.string().describe('Ключ задачи'),
    attachment: AttachmentEntitySchema.describe('Загруженный файл'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
