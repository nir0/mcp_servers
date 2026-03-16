import { describe, it, expect } from 'vitest';
import { GrepFilter } from '../../src/utils/grep-filter.js';

describe('GrepFilter', () => {
  describe('filter', () => {
    const boards = [
      { id: 1, name: 'Sprint Board', version: 2 },
      { id: 2, name: 'Kanban Board', version: 1 },
      { id: 3, name: 'CRM Tasks', version: 5 },
      { id: 4, name: 'Design Sprint', version: 3 },
    ];

    it('должен вернуть все элементы если grep не указан', () => {
      const result = GrepFilter.filter(boards, undefined);
      expect(result).toEqual(boards);
    });

    it('должен вернуть все элементы если grep пустая строка', () => {
      const result = GrepFilter.filter(boards, '');
      expect(result).toEqual(boards);
    });

    it('должен фильтровать массив по regex совпадению в строковом атрибуте', () => {
      const result = GrepFilter.filter(boards, 'Sprint');
      expect(result).toEqual([
        { id: 1, name: 'Sprint Board', version: 2 },
        { id: 4, name: 'Design Sprint', version: 3 },
      ]);
    });

    it('должен искать case-insensitive по умолчанию', () => {
      const result = GrepFilter.filter(boards, 'sprint');
      expect(result).toEqual([
        { id: 1, name: 'Sprint Board', version: 2 },
        { id: 4, name: 'Design Sprint', version: 3 },
      ]);
    });

    it('должен работать с regex паттернами', () => {
      const result = GrepFilter.filter(boards, '^CRM');
      expect(result).toEqual([{ id: 3, name: 'CRM Tasks', version: 5 }]);
    });

    it('должен матчить числовые значения (преобразованные в строку)', () => {
      const result = GrepFilter.filter(boards, '^5$');
      expect(result).toEqual([{ id: 3, name: 'CRM Tasks', version: 5 }]);
    });

    it('должен матчить по любому атрибуту объекта', () => {
      const items = [
        { id: 'PROJ-1', summary: 'Fix login bug', assignee: 'alice' },
        { id: 'PROJ-2', summary: 'Add feature', assignee: 'bob' },
        { id: 'PROJ-3', summary: 'Update docs', assignee: 'alice' },
      ];
      const result = GrepFilter.filter(items, 'alice');
      expect(result).toEqual([
        { id: 'PROJ-1', summary: 'Fix login bug', assignee: 'alice' },
        { id: 'PROJ-3', summary: 'Update docs', assignee: 'alice' },
      ]);
    });

    it('должен искать по вложенным объектам (JSON.stringify)', () => {
      const items = [
        { id: 1, name: 'Board A', owner: { login: 'admin', name: 'Admin User' } },
        { id: 2, name: 'Board B', owner: { login: 'dev', name: 'Developer' } },
      ];
      const result = GrepFilter.filter(items, 'admin');
      expect(result).toEqual([
        { id: 1, name: 'Board A', owner: { login: 'admin', name: 'Admin User' } },
      ]);
    });

    it('должен искать по элементам вложенных массивов', () => {
      const items = [
        { id: 1, name: 'Board', columns: [{ display: 'Open' }, { display: 'Closed' }] },
        { id: 2, name: 'Other', columns: [{ display: 'Todo' }, { display: 'Done' }] },
      ];
      const result = GrepFilter.filter(items, 'Open');
      expect(result).toEqual([
        { id: 1, name: 'Board', columns: [{ display: 'Open' }, { display: 'Closed' }] },
      ]);
    });

    it('должен вернуть пустой массив если ничего не совпало', () => {
      const result = GrepFilter.filter(boards, 'nonexistent');
      expect(result).toEqual([]);
    });

    it('должен работать с пустым массивом', () => {
      const result = GrepFilter.filter([], 'test');
      expect(result).toEqual([]);
    });

    it('должен работать со сложными regex', () => {
      const result = GrepFilter.filter(boards, 'Board|Tasks');
      expect(result).toEqual([
        { id: 1, name: 'Sprint Board', version: 2 },
        { id: 2, name: 'Kanban Board', version: 1 },
        { id: 3, name: 'CRM Tasks', version: 5 },
      ]);
    });

    it('должен выбросить ошибку при невалидном regex', () => {
      expect(() => GrepFilter.filter(boards, '[invalid')).toThrow();
    });

    it('должен корректно работать с boolean значениями', () => {
      const items = [
        { id: 1, name: 'Active', enabled: true },
        { id: 2, name: 'Disabled', enabled: false },
      ];
      const result = GrepFilter.filter(items, 'true');
      expect(result).toEqual([{ id: 1, name: 'Active', enabled: true }]);
    });

    it('должен корректно обрабатывать null и undefined значения атрибутов', () => {
      const items = [
        { id: 1, name: 'With value', description: 'text' },
        { id: 2, name: 'Null desc', description: null },
        { id: 3, name: 'No desc' },
      ];
      const result = GrepFilter.filter(items, 'text');
      expect(result).toEqual([{ id: 1, name: 'With value', description: 'text' }]);
    });

    it('не должен фильтровать не-массивы — вернуть как есть', () => {
      const single = { id: 1, name: 'Test' };
      const result = GrepFilter.filter(single, 'Test');
      expect(result).toEqual(single);
    });
  });
});
