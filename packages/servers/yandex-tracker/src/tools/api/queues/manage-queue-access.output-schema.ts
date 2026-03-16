/**
 * Output Schema для ManageQueueAccessTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля QueuePermission — optional, т.к. зависят от параметра `fields`.
 */

import { z } from 'zod';

/**
 * Схема QueuePermission entity (все поля optional — зависят от параметра fields)
 */
const QueuePermissionEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор права доступа'),
  self: z.string().optional().describe('URL ссылка в API'),
  display: z.string().optional().describe('Отображаемое имя'),
});

/**
 * Output Schema для ManageQueueAccessTool
 */
export const ManageQueueAccessOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    queueId: z.string().describe('Идентификатор очереди'),
    role: z.string().describe('Роль доступа'),
    action: z.string().describe('Действие (add/remove)'),
    subjectsProcessed: z.number().describe('Количество обработанных субъектов'),
    permissions: z.array(QueuePermissionEntitySchema).describe('Список прав доступа'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
