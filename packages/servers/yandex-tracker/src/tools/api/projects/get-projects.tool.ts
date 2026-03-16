/**
 * MCP Tool для получения списка проектов в Яндекс.Трекере
 */

import { BaseTool, ResponseFieldFilter, GrepFilter } from '@fractalizer/mcp-core';
import type { YandexTrackerFacade } from '#tracker_api/facade/index.js';
import type { ToolCallParams, ToolResult } from '@fractalizer/mcp-infrastructure';
import { GetProjectsParamsSchema } from './get-projects.schema.js';
import { GetProjectsOutputSchema } from './get-projects.output-schema.js';
import type { ProjectWithUnknownFields } from '#tracker_api/entities/index.js';

import { GET_PROJECTS_TOOL_METADATA } from './get-projects.metadata.js';

export class GetProjectsTool extends BaseTool<YandexTrackerFacade> {
  static override readonly METADATA = GET_PROJECTS_TOOL_METADATA;

  /**
   * Автоматическая генерация definition из Zod schema
   * Это исключает возможность несоответствия schema ↔ definition
   */
  protected override getParamsSchema(): typeof GetProjectsParamsSchema {
    return GetProjectsParamsSchema;
  }

  protected override getOutputSchema(): typeof GetProjectsOutputSchema {
    return GetProjectsOutputSchema;
  }

  async execute(params: ToolCallParams): Promise<ToolResult> {
    const validation = this.validateParams(params, GetProjectsParamsSchema);
    if (!validation.success) {
      return validation.error;
    }

    const { fields, perPage, page, expand, queueId, grep } = validation.data;

    try {
      this.logger.info('Получение списка проектов', {
        perPage: perPage ?? 50,
        page: page ?? 1,
        expand: expand ?? 'none',
        queueId: queueId ?? 'all',
      });

      const result = await this.facade.getProjects({
        perPage,
        page,
        expand,
        queueId,
      });

      this.logger.info('Список проектов получен', {
        count: result.projects.length,
        total: result.total,
      });

      const filteredProjects = result.projects.map((project) =>
        ResponseFieldFilter.filter<ProjectWithUnknownFields>(project, fields)
      );

      const grepResult = GrepFilter.filter(filteredProjects, grep);

      return this.formatSuccess({
        projects: grepResult,
        total: result.total,
        count: grepResult.length,
        fieldsReturned: fields,
        ...(grep && {
          grep,
          grepMeta: {
            fetchedTotal: filteredProjects.length,
            matchedCount: grepResult.length,
            page: page ?? 1,
            perPage: perPage ?? 50,
          },
        }),
      });
    } catch (error: unknown) {
      return this.formatError('Ошибка при получении списка проектов', error);
    }
  }
}
