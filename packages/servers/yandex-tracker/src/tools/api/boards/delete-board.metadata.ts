/**
 * Метаданные для DeleteBoardTool
 */

import { buildToolName, ToolCategory, ToolPriority } from '@fractalizer/mcp-core';
import type { StaticToolMetadata } from '@fractalizer/mcp-core';
import { MCP_TOOL_PREFIX } from '#constants';

/**
 * Статические метаданные для DeleteBoardTool
 */
export const DELETE_BOARD_TOOL_METADATA: StaticToolMetadata = {
  name: buildToolName('delete_board', MCP_TOOL_PREFIX),
  description: '[Boards/Delete] Удалить доску',
  category: ToolCategory.BOARDS,
  subcategory: 'delete',
  priority: ToolPriority.CRITICAL,
  tags: ['board', 'delete', 'remove', 'agile'],
  isHelper: false,
  requiresExplicitUserConsent: true,
} as const;
