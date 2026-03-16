/**
 * Output Schema для IssueUrlTool
 *
 * Описывает структуру ответа инструмента.
 */

import { z } from 'zod';

/**
 * Схема URL задачи
 */
const IssueUrlItemSchema = z.object({
  issueKey: z.string().describe('Ключ задачи'),
  url: z.string().describe('URL задачи в веб-интерфейсе'),
  description: z.string().describe('Описание ссылки'),
});

/**
 * Output Schema для IssueUrlTool
 */
export const IssueUrlOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    count: z.number().describe('Количество URL'),
    urls: z.array(IssueUrlItemSchema).describe('Список URL задач'),
  }),
});
