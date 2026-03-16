/**
 * Zod схема для параметра grep (фильтрация массивов по regex)
 *
 * Опциональный параметр: regex паттерн для клиентской фильтрации результатов.
 * Если объект массива содержит значение атрибута, совпадающее с паттерном —
 * объект включается в результат. Case-insensitive.
 */

import { z } from 'zod';

/**
 * Опциональный regex паттерн для фильтрации результатов
 *
 * @example
 * // Поиск досок со словом "Sprint"
 * grep: "Sprint"
 *
 * // Regex: все задачи с CRM или Design
 * grep: "CRM|Design"
 *
 * // Точное совпадение значения
 * grep: "^PROJ-123$"
 */
export const GrepSchema = z
  .string()
  .optional()
  .describe(
    'Regex для фильтрации результатов (case-insensitive). ' +
      'Если значение любого атрибута объекта совпадает с паттерном — объект возвращается целиком. ' +
      'Примеры: "Sprint", "CRM|Design", "^PROJ-\\d+$"'
  );

export type Grep = z.infer<typeof GrepSchema>;
