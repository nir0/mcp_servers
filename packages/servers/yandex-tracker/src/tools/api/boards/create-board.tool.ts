/**
 * MCP Tool для создания доски в Яндекс.Трекере
 */

import { BaseTool, ResponseFieldFilter } from '@fractalizer/mcp-core';
import type { YandexTrackerFacade } from '#tracker_api/facade/index.js';
import type { ToolCallParams, ToolResult } from '@fractalizer/mcp-infrastructure';
import { CreateBoardParamsSchema } from './create-board.schema.js';
import type { CreateBoardDto } from '#tracker_api/dto/index.js';
import { CREATE_BOARD_TOOL_METADATA } from './create-board.metadata.js';

export class CreateBoardTool extends BaseTool<YandexTrackerFacade> {
  static override readonly METADATA = CREATE_BOARD_TOOL_METADATA;

  protected override getParamsSchema(): typeof CreateBoardParamsSchema {
    return CreateBoardParamsSchema;
  }

  async execute(params: ToolCallParams): Promise<ToolResult> {
    const validation = this.validateParams(params, CreateBoardParamsSchema);
    if (!validation.success) {
      return validation.error;
    }

    const { fields, name, queue, columns, filter, orderBy, orderAsc, query, useRanking, country } =
      validation.data;

    try {
      this.logger.info('Создание новой доски', { name });

      const boardData: CreateBoardDto = {
        name,
        ...(queue && { queue }),
        ...(columns && { columns }),
        ...(filter && { filter }),
        ...(orderBy && { orderBy }),
        ...(orderAsc !== undefined && { orderAsc }),
        ...(query && { query }),
        ...(useRanking !== undefined && { useRanking }),
        ...(country && { country }),
      };

      const createdBoard = await this.facade.createBoard(boardData);

      this.logger.info('Доска успешно создана', {
        boardId: createdBoard.id,
        boardName: createdBoard.name,
      });

      const filteredBoard = ResponseFieldFilter.filter(createdBoard, fields);

      return this.formatSuccess({
        boardId: createdBoard.id,
        board: filteredBoard,
        fieldsReturned: fields,
      });
    } catch (error: unknown) {
      return this.formatError(`Ошибка при создании доски ${name}`, error);
    }
  }
}
