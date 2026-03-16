/**
 * Board Tools модуль - экспорт всех MCP tools для работы с досками
 *
 * Статус: ✅ Полностью реализовано
 * - ✅ get-boards tool
 * - ✅ get-board tool
 * - ✅ create-board tool
 * - ✅ update-board tool
 * - ✅ delete-board tool
 */

// GetBoards tool
export { GetBoardsTool } from './get-boards.tool.js';
export { GetBoardsParamsSchema, type GetBoardsParams } from './get-boards.schema.js';

// GetBoard tool
export { GetBoardTool } from './get-board.tool.js';
export { GetBoardParamsSchema, type GetBoardParams } from './get-board.schema.js';

// CreateBoard tool
export { CreateBoardTool } from './create-board.tool.js';
export { CreateBoardParamsSchema, type CreateBoardParams } from './create-board.schema.js';

// UpdateBoard tool
export { UpdateBoardTool } from './update-board.tool.js';
export { UpdateBoardParamsSchema, type UpdateBoardParams } from './update-board.schema.js';

// DeleteBoard tool
export { DeleteBoardTool } from './delete-board.tool.js';
export { DeleteBoardParamsSchema, type DeleteBoardParams } from './delete-board.schema.js';
