/**
 * Метаданные для GetBoardsTool
 */

import { buildToolName, ToolCategory, ToolPriority } from '@fractalizer/mcp-core';
import type { StaticToolMetadata } from '@fractalizer/mcp-core';
import { MCP_TOOL_PREFIX } from '#constants';

/**
 * Статические метаданные для GetBoardsTool
 */
export const GET_BOARDS_TOOL_METADATA: StaticToolMetadata = {
  name: buildToolName('get_boards', MCP_TOOL_PREFIX),
  description: '[Boards/Read] Получить список досок',
  category: ToolCategory.BOARDS,
  subcategory: 'read',
  priority: ToolPriority.HIGH,
  tags: ['board', 'read', 'list', 'agile'],
  isHelper: false,
  requiresExplicitUserConsent: false,
} as const;
