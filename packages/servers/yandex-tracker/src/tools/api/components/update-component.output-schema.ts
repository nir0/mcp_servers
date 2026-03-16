/**
 * Output Schema для UpdateComponentTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля Component — optional, т.к. зависят от параметра `fields`.
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
 * Схема QueueRef
 */
const QueueRefSchema = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема Component entity (все поля optional — зависят от параметра fields)
 */
const ComponentEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор компонента'),
  self: z.string().optional().describe('URL ссылка на компонент в API'),
  name: z.string().optional().describe('Название компонента'),
  queue: QueueRefSchema.optional().describe('Очередь компонента'),
  assignAuto: z.boolean().optional().describe('Автоназначение исполнителя'),
  description: z.string().optional().describe('Описание компонента'),
  lead: UserRefSchema.optional().describe('Руководитель компонента'),
});

/**
 * Output Schema для UpdateComponentTool
 */
export const UpdateComponentOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    component: ComponentEntitySchema.describe('Обновлённый компонент'),
    message: z.string().describe('Сообщение о результате'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
