/**
 * Output Schema для BulkMoveIssuesTool
 *
 * Описывает структуру ответа инструмента.
 * Операция асинхронная — возвращает operationId для проверки статуса.
 */

import { z } from 'zod';

/**
 * Output Schema для BulkMoveIssuesTool
 */
export const BulkMoveIssuesOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    message: z.string().describe('Сообщение о результате'),
    operationId: z.string().describe('Идентификатор операции для проверки статуса'),
    status: z.string().describe('Текущий статус операции'),
    totalIssues: z.number().describe('Общее количество задач'),
    targetQueue: z.string().describe('Целевая очередь'),
    moveAllFields: z.boolean().describe('Переместить все поля'),
    additionalFields: z.array(z.string()).describe('Дополнительные обновлённые поля'),
    note: z.string().describe('Инструкция по проверке статуса'),
  }),
});
