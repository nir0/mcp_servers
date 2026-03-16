/**
 * MCP Tool для получения списка компонентов очереди в Яндекс.Трекере
 */

import { BaseTool, ResponseFieldFilter, GrepFilter } from '@fractalizer/mcp-core';
import type { YandexTrackerFacade } from '#tracker_api/facade/index.js';
import type { ToolCallParams, ToolResult } from '@fractalizer/mcp-infrastructure';
import type { ComponentWithUnknownFields } from '#tracker_api/entities/index.js';
import { GetComponentsParamsSchema } from './get-components.schema.js';
import { GetComponentsOutputSchema } from './get-components.output-schema.js';

import { GET_COMPONENTS_TOOL_METADATA } from './get-components.metadata.js';

/**
 * Инструмент для получения списка компонентов очереди
 */
export class GetComponentsTool extends BaseTool<YandexTrackerFacade> {
  static override readonly METADATA = GET_COMPONENTS_TOOL_METADATA;

  /**
   * Автоматическая генерация definition из Zod schema
   * Это исключает возможность несоответствия schema ↔ definition
   */
  protected override getParamsSchema(): typeof GetComponentsParamsSchema {
    return GetComponentsParamsSchema;
  }

  protected override getOutputSchema(): typeof GetComponentsOutputSchema {
    return GetComponentsOutputSchema;
  }

  async execute(params: ToolCallParams): Promise<ToolResult> {
    const validation = this.validateParams(params, GetComponentsParamsSchema);
    if (!validation.success) {
      return validation.error;
    }

    const { queueId, fields, grep } = validation.data;

    try {
      this.logger.info('Получение списка компонентов очереди', {
        queueId,
      });

      const components = await this.facade.getComponents({ queueId });

      // Фильтрация полей для каждого компонента
      const filteredComponents = components.map((component) =>
        ResponseFieldFilter.filter<ComponentWithUnknownFields>(component, fields)
      );

      this.logger.info('Список компонентов получен', {
        count: components.length,
        queueId,
      });

      const grepResult = GrepFilter.filter(filteredComponents, grep);

      return this.formatSuccess({
        components: grepResult,
        count: grepResult.length,
        queueId,
        fieldsReturned: fields,
        ...(grep && {
          grep,
          grepMeta: {
            fetchedTotal: filteredComponents.length,
            matchedCount: grepResult.length,
          },
        }),
      });
    } catch (error: unknown) {
      return this.formatError('Ошибка при получении списка компонентов', error);
    }
  }
}
