/**
 * Unit тесты для GetBoardsTool
 * Включая поддержку outputSchema
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetBoardsTool } from '#tools/api/boards/get-boards.tool.js';
import type { YandexTrackerFacade } from '#tracker_api/facade/yandex-tracker.facade.js';
import type { Logger } from '@fractalizer/mcp-infrastructure/logging/index.js';
import type { BoardWithUnknownFields } from '#tracker_api/entities/index.js';

function createBoardFixture(overrides?: Partial<BoardWithUnknownFields>): BoardWithUnknownFields {
  return {
    id: '1',
    self: 'https://api.tracker.yandex.net/v2/boards/1',
    version: 1,
    name: 'Sprint Board',
    columns: [],
    ...overrides,
  };
}

describe('GetBoardsTool', () => {
  let mockTrackerFacade: YandexTrackerFacade;
  let mockLogger: Logger;
  let tool: GetBoardsTool;

  beforeEach(() => {
    mockTrackerFacade = {
      getBoards: vi.fn(),
    } as unknown as YandexTrackerFacade;

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as Logger;

    tool = new GetBoardsTool(mockTrackerFacade, mockLogger);
  });

  describe('getDefinition() - outputSchema', () => {
    it('должен включать outputSchema в definition', () => {
      const definition = tool.getDefinition();

      expect(definition.outputSchema).toBeDefined();
      expect(definition.outputSchema!.type).toBe('object');
      expect(definition.outputSchema!.properties).toBeDefined();
    });

    it('outputSchema должен описывать структуру ответа boards', () => {
      const definition = tool.getDefinition();
      const props = definition.outputSchema!.properties!;

      // Envelope fields
      expect(props['success']).toBeDefined();
      expect(props['data']).toBeDefined();
    });

    it('outputSchema.data должен содержать boards array и метаданные', () => {
      const definition = tool.getDefinition();
      const dataSchema = definition.outputSchema!.properties!['data'] as {
        type: string;
        properties: Record<string, unknown>;
      };

      expect(dataSchema.properties['boards']).toBeDefined();
      expect(dataSchema.properties['total']).toBeDefined();
      expect(dataSchema.properties['fieldsReturned']).toBeDefined();
    });

    it('outputSchema должен описывать поля Board entity (все optional)', () => {
      const definition = tool.getDefinition();
      const dataSchema = definition.outputSchema!.properties!['data'] as {
        properties: {
          boards: {
            items: {
              properties: Record<string, unknown>;
            };
          };
        };
      };

      const boardProps = dataSchema.properties.boards.items.properties;

      // Board entity fields должны быть описаны
      expect(boardProps['id']).toBeDefined();
      expect(boardProps['name']).toBeDefined();
      expect(boardProps['version']).toBeDefined();
      expect(boardProps['self']).toBeDefined();
      expect(boardProps['columns']).toBeDefined();
      expect(boardProps['filter']).toBeDefined();
    });

    it('inputSchema по-прежнему должен быть корректным', () => {
      const definition = tool.getDefinition();

      expect(definition.inputSchema).toBeDefined();
      expect(definition.inputSchema.type).toBe('object');
      expect(definition.inputSchema.properties['fields']).toBeDefined();
    });
  });

  describe('execute() - structuredContent', () => {
    it('должен возвращать structuredContent вместе с content', async () => {
      const mockBoards = [
        createBoardFixture({ id: '1', name: 'Board 1' }),
        createBoardFixture({ id: '2', name: 'Board 2' }),
      ];
      vi.mocked(mockTrackerFacade.getBoards).mockResolvedValue(mockBoards);

      const result = await tool.execute({ fields: ['id', 'name'] });

      expect(result.isError).toBeUndefined();
      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent!.success).toBe(true);
      expect(result.structuredContent!.data).toBeDefined();
    });

    it('structuredContent.data должен содержать boards и метаданные', async () => {
      const mockBoards = [createBoardFixture({ id: '1', name: 'Sprint' })];
      vi.mocked(mockTrackerFacade.getBoards).mockResolvedValue(mockBoards);

      const result = await tool.execute({ fields: ['id', 'name'] });
      const data = result.structuredContent!.data as {
        boards: Array<{ id: string; name: string }>;
        total: number;
        fieldsReturned: string[];
      };

      expect(data.boards).toHaveLength(1);
      expect(data.boards[0]!.id).toBe('1');
      expect(data.boards[0]!.name).toBe('Sprint');
      expect(data.total).toBe(1);
      expect(data.fieldsReturned).toEqual(['id', 'name']);
    });

    it('content и structuredContent должны содержать одинаковые данные', async () => {
      const mockBoards = [createBoardFixture()];
      vi.mocked(mockTrackerFacade.getBoards).mockResolvedValue(mockBoards);

      const result = await tool.execute({ fields: ['id', 'name'] });
      const contentParsed = JSON.parse(result.content[0]!.text) as {
        success: boolean;
        data: unknown;
      };

      expect(result.structuredContent).toEqual(contentParsed);
    });

    it('при ошибке НЕ должен возвращать structuredContent', async () => {
      vi.mocked(mockTrackerFacade.getBoards).mockRejectedValue(new Error('API Error'));

      const result = await tool.execute({ fields: ['id', 'name'] });

      expect(result.isError).toBe(true);
      expect(result.structuredContent).toBeUndefined();
    });
  });
});
