/**
 * Output Schema для DemoTool
 *
 * Описывает структуру ответа демонстрационного инструмента.
 */

import { z } from 'zod';

/**
 * Output Schema для DemoTool
 */
export const DemoOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    status: z.string().describe('Статус выполнения'),
    message: z.string().describe('Демонстрационный ответ'),
    timestamp: z.string().describe('Временная метка (ISO 8601)'),
    info: z.string().describe('Информация о tool'),
  }),
});
