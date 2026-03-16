/**
 * Интеграционные тесты для delete-board tool
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestClient } from '#integration/helpers/mcp-client.js';
import { createMockServer } from '#integration/helpers/mock-server.js';
import type { TestMCPClient } from '#integration/helpers/mcp-client.js';
import type { MockServer } from '#integration/helpers/mock-server.js';

describe('delete-board integration tests', () => {
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
    it('должен удалить доску', async () => {
      // Arrange
      const boardId = '42';
      mockServer.mockDeleteBoardSuccess(boardId);

      // Act
      const result = await client.callTool('fr_yandex_tracker_delete_board', {
        boardId,
      });

      // Assert
      expect(result.isError).toBeUndefined();
      const response = JSON.parse(result.content[0]!.text);
      expect(response.data.message).toContain('42');
      expect(response.data.boardId).toBe('42');
      mockServer.assertAllRequestsDone();
    });
  });

  describe('Error Handling', () => {
    it('должен обработать ошибку 404 (доска не найдена)', async () => {
      // Arrange
      const boardId = '999';
      mockServer.mockDeleteBoard404(boardId);

      // Act
      const result = await client.callTool('fr_yandex_tracker_delete_board', {
        boardId,
      });

      // Assert
      expect(result.isError).toBe(true);
      mockServer.assertAllRequestsDone();
    });
  });
});
