/**
 * Интеграционные тесты для get-board tool
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestClient } from '#integration/helpers/mcp-client.js';
import { createMockServer } from '#integration/helpers/mock-server.js';
import type { TestMCPClient } from '#integration/helpers/mcp-client.js';
import type { MockServer } from '#integration/helpers/mock-server.js';
import { STANDARD_BOARD_FIELDS } from '#helpers/test-fields.js';

describe('get-board integration tests', () => {
  let client: TestMCPClient;
  let mockServer: MockServer;

  beforeEach(async () => {
    client = await createTestClient({ logLevel: 'silent' });
    mockServer = createMockServer(client.getAxiosInstance());
  });

  afterEach(() => {
    mockServer.cleanup();
  });

  describe('Happy Path', () => {
    it('должен получить доску по ID', async () => {
      // Arrange
      const boardId = '42';
      mockServer.mockGetBoardSuccess(boardId, { name: 'My Sprint Board' });

      // Act
      const result = await client.callTool('fr_yandex_tracker_get_board', {
        boardId,
        fields: STANDARD_BOARD_FIELDS,
      });

      // Assert
      expect(result.isError).toBeUndefined();
      const response = JSON.parse(result.content[0]!.text);
      expect(response.data.board).toBeDefined();
      expect(response.data.board.id).toBe('42');
      expect(response.data.board.name).toBe('My Sprint Board');
      mockServer.assertAllRequestsDone();
    });
  });

  describe('Error Handling', () => {
    it('должен обработать ошибку 404 (доска не найдена)', async () => {
      // Arrange
      const boardId = '999';
      mockServer.mockGetBoard404(boardId);

      // Act
      const result = await client.callTool('fr_yandex_tracker_get_board', {
        boardId,
        fields: STANDARD_BOARD_FIELDS,
      });

      // Assert
      expect(result.isError).toBe(true);
      mockServer.assertAllRequestsDone();
    });
  });

  describe('Response Structure', () => {
    it('должен вернуть корректную структуру доски', async () => {
      // Arrange
      const boardId = '1';
      mockServer.mockGetBoardSuccess(boardId);

      // Act
      const result = await client.callTool('fr_yandex_tracker_get_board', {
        boardId,
        fields: STANDARD_BOARD_FIELDS,
      });

      // Assert
      expect(result.isError).toBeUndefined();
      const response = JSON.parse(result.content[0]!.text);
      const board = response.data.board;

      expect(board).toHaveProperty('id');
      expect(board).toHaveProperty('name');
      expect(board).toHaveProperty('version');
      expect(board).toHaveProperty('columns');
      mockServer.assertAllRequestsDone();
    });
  });
});
