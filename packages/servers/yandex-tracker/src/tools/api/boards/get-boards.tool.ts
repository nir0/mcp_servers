/**
 * MCP Tool для получения списка досок в Яндекс.Трекере
 */

import { BaseTool, ResponseFieldFilter, GrepFilter } from '@fractalizer/mcp-core';
import type { YandexTrackerFacade } from '#tracker_api/facade/index.js';
import type { ToolCallParams, ToolResult } from '@fractalizer/mcp-infrastructure';
import { GetBoardsParamsSchema } from './get-boards.schema.js';
import { GetBoardsOutputSchema } from './get-boards.output-schema.js';
import { GET_BOARDS_TOOL_METADATA } from './get-boards.metadata.js';

export class GetBoardsTool extends BaseTool<YandexTrackerFacade> {
  static override readonly METADATA = GET_BOARDS_TOOL_METADATA;

  protected override getParamsSchema(): typeof GetBoardsParamsSchema {
    return GetBoardsParamsSchema;
  }

  protected override getOutputSchema(): typeof GetBoardsOutputSchema {
    return GetBoardsOutputSchema;
  }

  async execute(params: ToolCallParams): Promise<ToolResult> {
    const validation = this.validateParams(params, GetBoardsParamsSchema);
    if (!validation.success) {
      return validation.error;
    }

    const { fields, grep } = validation.data;

    try {
      this.logger.info('Получение списка досок');

      const boards = await this.facade.getBoards();

      this.logger.info('Список досок получен', {
        count: boards.length,
      });

      const filteredBoards = boards.map((board) => ResponseFieldFilter.filter(board, fields));

      const grepResult = GrepFilter.filter(filteredBoards, grep);

      return this.formatSuccess({
        boards: grepResult,
        total: grepResult.length,
        fieldsReturned: fields,
        ...(grep && {
          grep,
          grepMeta: {
            fetchedTotal: filteredBoards.length,
            matchedCount: grepResult.length,
          },
        }),
      });
    } catch (error: unknown) {
      return this.formatError('Ошибка при получении списка досок', error);
    }
  }
}
