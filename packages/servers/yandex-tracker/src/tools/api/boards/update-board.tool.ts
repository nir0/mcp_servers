/**
 * MCP Tool для обновления доски в Яндекс.Трекере
 */

import { BaseTool, ResponseFieldFilter } from '@fractalizer/mcp-core';
import type { YandexTrackerFacade } from '#tracker_api/facade/index.js';
import type { ToolCallParams, ToolResult } from '@fractalizer/mcp-infrastructure';
import { UpdateBoardParamsSchema } from './update-board.schema.js';
import type { UpdateBoardDto } from '#tracker_api/dto/index.js';
import { UPDATE_BOARD_TOOL_METADATA } from './update-board.metadata.js';

export class UpdateBoardTool extends BaseTool<YandexTrackerFacade> {
  static override readonly METADATA = UPDATE_BOARD_TOOL_METADATA;

  protected override getParamsSchema(): typeof UpdateBoardParamsSchema {
    return UpdateBoardParamsSchema;
  }

  async execute(params: ToolCallParams): Promise<ToolResult> {
    const validation = this.validateParams(params, UpdateBoardParamsSchema);
    if (!validation.success) {
      return validation.error;
    }

    const {
      fields,
      boardId,
      name,
      version,
      queue,
      columns,
      filter,
      orderBy,
      orderAsc,
      query,
      useRanking,
      country,
    } = validation.data;

    try {
      this.logger.info('Обновление доски', { boardId });

      const updateData: Omit<UpdateBoardDto, 'boardId'> = {
        ...(name && { name }),
        ...(version !== undefined && { version }),
        ...(queue && { queue }),
        ...(columns && { columns }),
        ...(filter && { filter }),
        ...(orderBy && { orderBy }),
        ...(orderAsc !== undefined && { orderAsc }),
        ...(query && { query }),
        ...(useRanking !== undefined && { useRanking }),
        ...(country && { country }),
      };

      const updatedBoard = await this.facade.updateBoard(boardId, updateData);

      this.logger.info('Доска успешно обновлена', {
        boardId: updatedBoard.id,
        boardName: updatedBoard.name,
      });

      const filteredBoard = ResponseFieldFilter.filter(updatedBoard, fields);

      return this.formatSuccess({
        boardId: updatedBoard.id,
        board: filteredBoard,
        fieldsReturned: fields,
      });
    } catch (error: unknown) {
      return this.formatError(`Ошибка при обновлении доски ${boardId}`, error);
    }
  }
}
