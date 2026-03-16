/**
 * Метаданные для CreateBoardTool
 */

import { buildToolName, ToolCategory, ToolPriority } from '@fractalizer/mcp-core';
import type { StaticToolMetadata } from '@fractalizer/mcp-core';
import { MCP_TOOL_PREFIX } from '#constants';

/**
 * Статические метаданные для CreateBoardTool
 */
export const CREATE_BOARD_TOOL_METADATA: StaticToolMetadata = {
  name: buildToolName('create_board', MCP_TOOL_PREFIX),
  description: '[Boards/Write] Создать новую доску',
  category: ToolCategory.BOARDS,
  subcategory: 'write',
  priority: ToolPriority.CRITICAL,
  tags: ['board', 'create', 'write', 'agile'],
  isHelper: false,
  requiresExplicitUserConsent: true,
} as const;
