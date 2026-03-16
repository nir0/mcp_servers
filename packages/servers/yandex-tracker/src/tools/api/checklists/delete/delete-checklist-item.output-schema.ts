/**
 * Output Schema для DeleteChecklistItemTool
 *
 * Описывает структуру ответа инструмента.
 * DELETE операция не возвращает данные элемента.
 */

import { z } from 'zod';

/**
 * Схема успешного результата для одного удалённого элемента
 */
const DeleteChecklistSuccessItemSchema = z.object({
  issueId: z.string().describe('Идентификатор задачи'),
  itemId: z.string().optional().describe('Идентификатор удалённого элемента'),
  success: z.boolean().describe('Статус удаления'),
});

/**
 * Схема ошибки для одного элемента
 */
const DeleteChecklistErrorItemSchema = z.object({
  issueId: z.string().describe('Идентификатор задачи'),
  itemId: z.string().optional().describe('Идентификатор элемента'),
  error: z.string().describe('Описание ошибки'),
});

/**
 * Output Schema для DeleteChecklistItemTool
 */
export const DeleteChecklistItemOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    total: z.number().describe('Общее количество запрошенных операций'),
    successful: z.number().describe('Количество успешных операций'),
    failed: z.number().describe('Количество неуспешных операций'),
    items: z.array(DeleteChecklistSuccessItemSchema).describe('Удалённые элементы'),
    errors: z.array(DeleteChecklistErrorItemSchema).describe('Ошибки удаления'),
  }),
});
