/**
 * Утилита для фильтрации массивов объектов по regex паттерну
 *
 * Ответственность (SRP):
 * - Фильтрация массива объектов: если regex матчит любое значение атрибута — объект остаётся
 * - Case-insensitive поиск по умолчанию
 * - Поддержка вложенных объектов и массивов (через JSON.stringify)
 */

export class GrepFilter {
  /**
   * Фильтрует массив объектов по regex паттерну
   *
   * Для каждого объекта проверяются все значения атрибутов:
   * - Строки проверяются напрямую
   * - Числа, boolean конвертируются в строку
   * - Вложенные объекты и массивы проверяются через JSON.stringify
   * - null/undefined пропускаются
   *
   * Если хотя бы одно значение матчит regex — весь объект включается в результат.
   *
   * @param data - Массив объектов для фильтрации (или одиночный объект — возвращается как есть)
   * @param grep - Regex паттерн (case-insensitive). Если undefined или пустая строка — возвращает все данные
   * @returns Отфильтрованный массив
   *
   * @example
   * const boards = [
   *   { id: 1, name: 'Sprint Board' },
   *   { id: 2, name: 'Kanban Board' },
   *   { id: 3, name: 'CRM Tasks' },
   * ];
   * GrepFilter.filter(boards, 'sprint');
   * // Result: [{ id: 1, name: 'Sprint Board' }]
   *
   * @example
   * GrepFilter.filter(boards, 'Board|Tasks');
   * // Result: all three items
   */
  static filter<T>(data: T, grep: string | undefined): T {
    if (!grep) {
      return data;
    }

    if (!Array.isArray(data)) {
      return data;
    }

    const regex = new RegExp(grep, 'i');

    return data.filter((item) => this.matchesAnyValue(item, regex)) as T;
  }

  /**
   * Проверяет, матчит ли хотя бы одно значение объекта regex паттерну
   */
  private static matchesAnyValue(obj: unknown, regex: RegExp): boolean {
    if (obj === null || obj === undefined) {
      return false;
    }

    if (typeof obj === 'string') {
      return regex.test(obj);
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return regex.test(String(obj));
    }

    if (typeof obj !== 'object') {
      return false;
    }

    return Object.values(obj as Record<string, unknown>).some((value) =>
      this.matchesValue(value, regex)
    );
  }

  private static matchesValue(value: unknown, regex: RegExp): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value === 'string') {
      return regex.test(value);
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return regex.test(String(value));
    }

    if (typeof value === 'object') {
      return regex.test(JSON.stringify(value));
    }

    return false;
  }
}
