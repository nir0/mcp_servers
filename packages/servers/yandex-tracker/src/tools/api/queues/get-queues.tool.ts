/**
 * MCP Tool для получения списка очередей в Яндекс.Трекере
 */

import { BaseTool, ResponseFieldFilter, GrepFilter } from '@fractalizer/mcp-core';
import type { YandexTrackerFacade } from '#tracker_api/facade/index.js';
import type { ToolCallParams, ToolResult } from '@fractalizer/mcp-infrastructure';
import { GetQueuesParamsSchema } from './get-queues.schema.js';

import type { QueueWithUnknownFields } from '#tracker_api/entities/index.js';
import { GET_QUEUES_TOOL_METADATA } from './get-queues.metadata.js';

/**
 * Инструмент для получения списка очередей
 */
export class GetQueuesTool extends BaseTool<YandexTrackerFacade> {
  static override readonly METADATA = GET_QUEUES_TOOL_METADATA;

  /**
   * Автоматическая генерация definition из Zod schema
   * Это исключает возможность несоответствия schema ↔ definition
   */
  protected override getParamsSchema(): typeof GetQueuesParamsSchema {
    return GetQueuesParamsSchema;
  }
  async execute(params: ToolCallParams): Promise<ToolResult> {
    const validation = this.validateParams(params, GetQueuesParamsSchema);
    if (!validation.success) {
      return validation.error;
    }

    const { fields, perPage = 50, page = 1, expand, grep } = validation.data;

    try {
      this.logger.info('Получение списка очередей', {
        perPage,
        page,
        expand: expand ?? 'none',
      });

      const queues = await this.facade.getQueues({ perPage, page, expand });

      this.logger.info('Список очередей получен', {
        count: queues.length,
        page,
      });

      const filteredQueues = queues.map((queue) =>
        ResponseFieldFilter.filter<QueueWithUnknownFields>(queue, fields)
      );

      const grepResult = GrepFilter.filter(filteredQueues, grep);

      return this.formatSuccess({
        queues: grepResult,
        count: grepResult.length,
        page,
        perPage,
        fieldsReturned: fields,
        ...(grep && {
          grep,
          grepMeta: {
            fetchedTotal: filteredQueues.length,
            matchedCount: grepResult.length,
            page,
            perPage,
          },
        }),
      });
    } catch (error: unknown) {
      return this.formatError('Ошибка при получении списка очередей', error);
    }
  }
}
