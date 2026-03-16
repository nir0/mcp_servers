/**
 * Output Schema для GetIssueTransitionsTool
 *
 * Описывает структуру ответа инструмента.
 * Все поля Transition entity — optional, т.к. зависят от параметра `fields`.
 */

import { z } from 'zod';

/**
 * Схема статуса (целевой статус перехода)
 */
const StatusSchema = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  display: z.string().optional(),
});

/**
 * Схема экрана перехода (screen)
 */
const ScreenSchema = z.object({
  id: z.string().optional(),
  self: z.string().optional(),
});

/**
 * Схема Transition entity (все поля optional — зависят от параметра fields)
 */
const TransitionEntitySchema = z.object({
  id: z.string().optional().describe('Идентификатор перехода'),
  self: z.string().optional().describe('URL перехода'),
  to: StatusSchema.optional().describe('Целевой статус перехода'),
  screen: ScreenSchema.optional().describe('Форма для заполнения при переходе'),
});

/**
 * Output Schema для GetIssueTransitionsTool
 */
export const GetIssueTransitionsOutputSchema = z.object({
  success: z.boolean().describe('Статус выполнения'),
  data: z.object({
    issueKey: z.string().describe('Ключ задачи'),
    transitionsCount: z.number().describe('Количество доступных переходов'),
    transitions: z.array(TransitionEntitySchema).describe('Доступные переходы'),
    fieldsReturned: z.array(z.string()).describe('Возвращённые поля'),
  }),
});
