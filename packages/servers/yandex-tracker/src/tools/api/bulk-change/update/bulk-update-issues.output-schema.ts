/**
 * Output Schema для BulkUpdateIssuesTool
 *
 * Описывает структуру ответа инструмента.
 * Операция асинхронная — возвращает operationId для проверки статуса.
 */

import { z } from 'zod';

/**
 * Output Schema для BulkUpdateIssuesTool
 */
export const BulkUpdateIssuesOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    message: z.string().describe('Сообщение о результате'),
    operationId: z.string().describe('Идентификатор операции для проверки статуса'),
    status: z.string().describe('Текущий статус операции'),
    totalIssues: z.number().describe('Общее количество задач'),
    updatedFields: z.array(z.string()).describe('Обновляемые поля'),
    note: z.string().describe('Инструкция по проверке статуса'),
  }),
});
