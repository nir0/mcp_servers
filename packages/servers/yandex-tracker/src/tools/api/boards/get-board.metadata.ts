/**
 * Метаданные для GetBoardTool
 */

import { buildToolName, ToolCategory, ToolPriority } from '@fractalizer/mcp-core';
import type { StaticToolMetadata } from '@fractalizer/mcp-core';
import { MCP_TOOL_PREFIX } from '#constants';

/**
 * Статические метаданные для GetBoardTool
 */
export const GET_BOARD_TOOL_METADATA: StaticToolMetadata = {
  name: buildToolName('get_board', MCP_TOOL_PREFIX),
  description: '[Boards/Read] Получить доску по ID',
  category: ToolCategory.BOARDS,
  subcategory: 'read',
  priority: ToolPriority.HIGH,
  tags: ['board', 'read', 'details', 'agile'],
  isHelper: false,
  requiresExplicitUserConsent: false,
} as const;
