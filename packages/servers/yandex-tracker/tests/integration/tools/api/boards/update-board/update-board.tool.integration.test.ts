/**
 * Интеграционные тесты для update-board tool
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestClient } from '#integration/helpers/mcp-client.js';
import { createMockServer } from '#integration/helpers/mock-server.js';
import type { TestMCPClient } from '#integration/helpers/mcp-client.js';
import type { MockServer } from '#integration/helpers/mock-server.js';
import { STANDARD_BOARD_FIELDS } from '#helpers/test-fields.js';

describe('update-board integration tests', () => {
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
    it('должен обновить название доски', async () => {
      // Arrange
      const boardId = '42';
      mockServer.mockUpdateBoardSuccess(boardId, { name: 'Updated Board Name' });

      // Act
      const result = await client.callTool('fr_yandex_tracker_update_board', {
        boardId,
        name: 'Updated Board Name',
        fields: STANDARD_BOARD_FIELDS,
      });

      // Assert
      expect(result.isError).toBeUndefined();
      const response = JSON.parse(result.content[0]!.text);
      expect(response.data.board).toBeDefined();
      expect(response.data.board.name).toBe('Updated Board Name');
      mockServer.assertAllRequestsDone();
    });

    it('должен обновить доску с версией для оптимистичной блокировки', async () => {
      // Arrange
      const boardId = '10';
      mockServer.mockUpdateBoardSuccess(boardId, { name: 'Board v2', version: 2 });

      // Act
      const result = await client.callTool('fr_yandex_tracker_update_board', {
        boardId,
        name: 'Board v2',
        version: 1,
        fields: STANDARD_BOARD_FIELDS,
      });

      // Assert
      expect(result.isError).toBeUndefined();
      const response = JSON.parse(result.content[0]!.text);
      expect(response.data.board.version).toBe(2);
      mockServer.assertAllRequestsDone();
    });
  });

  describe('Error Handling', () => {
    it('должен обработать ошибку 404 (доска не найдена)', async () => {
      // Arrange
      const boardId = '999';
      mockServer.mockUpdateBoard404(boardId);

      // Act
      const result = await client.callTool('fr_yandex_tracker_update_board', {
        boardId,
        name: 'Nonexistent Board',
        fields: STANDARD_BOARD_FIELDS,
      });

      // Assert
      expect(result.isError).toBe(true);
      mockServer.assertAllRequestsDone();
    });
  });

  describe('Response Structure', () => {
    it('должен вернуть полную структуру обновленной доски', async () => {
      // Arrange
      const boardId = '1';
      mockServer.mockUpdateBoardSuccess(boardId);

      // Act
      const result = await client.callTool('fr_yandex_tracker_update_board', {
        boardId,
        name: 'Updated',
        fields: STANDARD_BOARD_FIELDS,
      });

      // Assert
      expect(result.isError).toBeUndefined();
      const response = JSON.parse(result.content[0]!.text);
      const board = response.data.board;

      expect(board).toHaveProperty('id');
      expect(board).toHaveProperty('name');
      expect(board).toHaveProperty('version');
      mockServer.assertAllRequestsDone();
    });
  });
});
