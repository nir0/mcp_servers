/**
 * Интеграционные тесты для create-board tool
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestClient } from '#integration/helpers/mcp-client.js';
import { createMockServer } from '#integration/helpers/mock-server.js';
import type { TestMCPClient } from '#integration/helpers/mcp-client.js';
import type { MockServer } from '#integration/helpers/mock-server.js';
import { STANDARD_BOARD_FIELDS } from '#helpers/test-fields.js';

describe('create-board integration tests', () => {
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
    it('должен создать доску с минимальными параметрами', async () => {
      // Arrange
      mockServer.mockCreateBoardSuccess({ name: 'New Sprint Board' });

      // Act
      const result = await client.callTool('fr_yandex_tracker_create_board', {
        name: 'New Sprint Board',
        fields: STANDARD_BOARD_FIELDS,
      });

      // Assert
      expect(result.isError).toBeUndefined();
      const response = JSON.parse(result.content[0]!.text);
      expect(response.data.board).toBeDefined();
      expect(response.data.board.name).toBe('New Sprint Board');
      mockServer.assertAllRequestsDone();
    });

    it('должен создать доску с полными параметрами', async () => {
      // Arrange
      mockServer.mockCreateBoardSuccess({
        name: 'Full Board',
        columns: [
          { id: 'col-1', name: 'Open', statuses: [{ id: '1', key: 'open', display: 'Open' }] },
          {
            id: 'col-2',
            name: 'Closed',
            statuses: [{ id: '2', key: 'closed', display: 'Closed' }],
          },
        ],
      });

      // Act
      const result = await client.callTool('fr_yandex_tracker_create_board', {
        name: 'Full Board',
        queue: 'TEST',
        columns: [
          { name: 'Open', statuses: ['open'] },
          { name: 'Closed', statuses: ['closed'] },
        ],
        orderBy: 'updated',
        orderAsc: false,
        fields: STANDARD_BOARD_FIELDS,
      });

      // Assert
      expect(result.isError).toBeUndefined();
      const response = JSON.parse(result.content[0]!.text);
      expect(response.data.board).toBeDefined();
      expect(response.data.board.name).toBe('Full Board');
      mockServer.assertAllRequestsDone();
    });
  });

  describe('Error Handling', () => {
    it('должен обработать ошибку 403 (нет прав)', async () => {
      // Arrange
      mockServer.mockCreateBoard403();

      // Act
      const result = await client.callTool('fr_yandex_tracker_create_board', {
        name: 'Forbidden Board',
        fields: STANDARD_BOARD_FIELDS,
      });

      // Assert
      expect(result.isError).toBe(true);
      mockServer.assertAllRequestsDone();
    });
  });

  describe('Response Structure', () => {
    it('должен вернуть полную структуру созданной доски', async () => {
      // Arrange
      mockServer.mockCreateBoardSuccess({ name: 'Test Board' });

      // Act
      const result = await client.callTool('fr_yandex_tracker_create_board', {
        name: 'Test Board',
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
