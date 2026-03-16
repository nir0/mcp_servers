/**
 * Output Schema для EditCommentTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля Comment entity — optional, т.к. зависят от параметра `fields`.
 */

import { z } from 'zod';

/**
 * Схема UserRef (автор комментария и т.п.)
 */
const UserRefSchema = z.object({
  self: z.string().optional(),
  id: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема вложения в комментарии
 */
const CommentAttachmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  size: z.number().optional(),
});

/**
 * Схема Comment entity (все поля optional — зависят от параметра fields)
 */
const CommentEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор комментария'),
  self: z.string().optional().describe('URL ссылка на комментарий в API'),
  text: z.string().optional().describe('Текст комментария'),
  createdBy: UserRefSchema.optional().describe('Автор комментария'),
  createdAt: z.string().optional().describe('Дата создания в формате ISO 8601'),
  updatedBy: UserRefSchema.optional().describe('Кто последним изменил комментарий'),
  updatedAt: z.string().optional().describe('Дата последнего изменения в формате ISO 8601'),
  version: z.number().optional().describe('Версия комментария'),
  transport: z.enum(['internal', 'email']).optional().describe('Способ доставки комментария'),
  attachments: z.array(CommentAttachmentSchema).optional().describe('Вложения в комментарии'),
});

/**
 * Схема успешного результата для одного комментария
 */
const EditCommentSuccessItemSchema = z.object({
  issueId: z.string().describe('Идентификатор задачи'),
  commentId: z.string().optional().describe('Идентификатор отредактированного комментария'),
  comment: CommentEntitySchema.describe('Отредактированный комментарий'),
});

/**
 * Схема ошибки для одного комментария
 */
const EditCommentErrorItemSchema = z.object({
  issueId: z.string().describe('Идентификатор задачи'),
  commentId: z.string().optional().describe('Идентификатор комментария'),
  error: z.string().describe('Описание ошибки'),
});

/**
 * Output Schema для EditCommentTool
 */
export const EditCommentOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    total: z.number().describe('Общее количество запрошенных операций'),
    successful: z.array(EditCommentSuccessItemSchema).describe('Отредактированные комментарии'),
    failed: z.array(EditCommentErrorItemSchema).describe('Ошибки редактирования'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
