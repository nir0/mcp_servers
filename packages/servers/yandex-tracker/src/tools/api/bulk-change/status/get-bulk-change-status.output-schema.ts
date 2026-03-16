/**
 * Output Schema для GetBulkChangeStatusTool
 *
 * Описывает структуру ответа инструмента.
 */

import { z } from 'zod';

/**
 * Схема ошибки bulk операции
 */
const BulkChangeErrorSchema = z.object({
  errorCode: z.string().optional().describe('Код ошибки'),
  message: z.string().optional().describe('Сообщение об ошибке'),
  issueKey: z.string().optional().describe('Ключ задачи с ошибкой'),
});

/**
 * Схема параметров операции
 */
const OperationParametersSchema = z.object({
  queue: z.string().optional().describe('Очередь назначения (для MOVE)'),
  transition: z.string().optional().describe('ID перехода (для TRANSITION)'),
  values: z.record(z.string(), z.unknown()).optional().describe('Обновляемые поля (для UPDATE)'),
});

/**
 * Output Schema для GetBulkChangeStatusTool
 */
export const GetBulkChangeStatusOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    operationId: z.string().describe('Идентификатор операции'),
    status: z.string().describe('Статус операции (PENDING/RUNNING/COMPLETED/FAILED/CANCELLED)'),
    type: z.string().optional().describe('Тип операции (UPDATE/TRANSITION/MOVE)'),
    progress: z.number().describe('Прогресс выполнения (0-100)'),
    totalIssues: z.number().optional().describe('Общее количество задач'),
    processedIssues: z.number().optional().describe('Обработано задач'),
    failedIssues: z.number().optional().describe('Задач с ошибками'),
    createdAt: z.string().optional().describe('Дата создания (ISO 8601)'),
    startedAt: z.string().optional().describe('Дата начала (ISO 8601)'),
    completedAt: z.string().optional().describe('Дата завершения (ISO 8601)'),
    errors: z.array(BulkChangeErrorSchema).optional().describe('Ошибки операции'),
    errorsCount: z.number().optional().describe('Количество ошибок'),
    parameters: OperationParametersSchema.optional().describe('Параметры операции'),
    message: z.string().describe('Статусное сообщение'),
  }),
});
