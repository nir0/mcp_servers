/**
 * Интеграционные тесты для get-boards tool
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestClient } from '#integration/helpers/mcp-client.js';
import { createMockServer } from '#integration/helpers/mock-server.js';
import type { TestMCPClient } from '#integration/helpers/mcp-client.js';
import type { MockServer } from '#integration/helpers/mock-server.js';
import { STANDARD_BOARD_FIELDS } from '#helpers/test-fields.js';

describe('get-boards integration tests', () => {
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
    it('должен получить список досок', async () => {
      // Arrange
      mockServer.mockGetBoardsSuccess();

      // Act
      const result = await client.callTool('fr_yandex_tracker_get_boards', {
        fields: STANDARD_BOARD_FIELDS,
      });

      // Assert
      expect(result.isError).toBeUndefined();
      const response = JSON.parse(result.content[0]!.text);
      expect(response.data.boards).toBeDefined();
      expect(Array.isArray(response.data.boards)).toBe(true);
      expect(response.data.boards.length).toBe(2);
      mockServer.assertAllRequestsDone();
    });

    it('должен получить пустой список досок', async () => {
      // Arrange
      mockServer.mockGetBoardsEmpty();

      // Act
      const result = await client.callTool('fr_yandex_tracker_get_boards', {
        fields: STANDARD_BOARD_FIELDS,
      });

      // Assert
      expect(result.isError).toBeUndefined();
      const response = JSON.parse(result.content[0]!.text);
      expect(response.data.boards).toBeDefined();
      expect(response.data.boards.length).toBe(0);
      mockServer.assertAllRequestsDone();
    });
  });

  describe('Response Structure', () => {
    it('должен вернуть корректную структуру доски', async () => {
      // Arrange
      mockServer.mockGetBoardsSuccess();

      // Act
      const result = await client.callTool('fr_yandex_tracker_get_boards', {
        fields: STANDARD_BOARD_FIELDS,
      });

      // Assert
      expect(result.isError).toBeUndefined();
      const response = JSON.parse(result.content[0]!.text);
      const board = response.data.boards[0];

      expect(board).toHaveProperty('id');
      expect(board).toHaveProperty('name');
      expect(board).toHaveProperty('version');
      mockServer.assertAllRequestsDone();
    });
  });
});
