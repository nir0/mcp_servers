/**
 * Тесты для поддержки outputSchema в BaseTool
 *
 * outputSchema позволяет LLM агентам видеть структуру ответа инструмента,
 * включая доступные поля и их типы.
 */

import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { BaseTool } from '../../src/tools/base/base-tool.js';
import type { ToolCallParams, ToolResult } from '@fractalizer/mcp-infrastructure';
import type { StaticToolMetadata } from '../../src/tools/base/tool-metadata.js';
import { ToolCategory } from '../../src/tools/base/tool-metadata.js';

// --- Test Schemas ---

const TestInputSchema = z.object({
  query: z.string().describe('Поисковый запрос'),
  limit: z.number().int().positive().optional().describe('Лимит результатов'),
});

const TestOutputSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().describe('Идентификатор'),
      name: z.string().describe('Название'),
      score: z.number().optional().describe('Релевантность'),
    })
  ),
  total: z.number().describe('Общее количество'),
});

// --- Test Tool Implementations ---

const TEST_METADATA: StaticToolMetadata = {
  name: 'test_tool',
  description: 'Test tool with output schema',
  category: ToolCategory.DEMO,
  tags: ['test'],
  isHelper: true,
};

/** Tool с outputSchema */
class ToolWithOutputSchema extends BaseTool {
  static override readonly METADATA = TEST_METADATA;

  protected override getParamsSchema() {
    return TestInputSchema;
  }

  protected override getOutputSchema() {
    return TestOutputSchema;
  }

  async execute(params: ToolCallParams): Promise<ToolResult> {
    const validation = this.validateParams(params, TestInputSchema);
    if (!validation.success) return validation.error;

    return this.formatSuccess({
      items: [{ id: '1', name: 'Test', score: 0.95 }],
      total: 1,
    });
  }
}

/** Tool без outputSchema (обратная совместимость) */
class ToolWithoutOutputSchema extends BaseTool {
  static override readonly METADATA = {
    ...TEST_METADATA,
    name: 'tool_without_output_schema',
  };

  protected override getParamsSchema() {
    return TestInputSchema;
  }

  async execute(_params: ToolCallParams): Promise<ToolResult> {
    return this.formatSuccess({ result: 'ok' });
  }
}

// --- Tests ---

const mockLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

describe('BaseTool outputSchema support', () => {
  describe('getDefinition()', () => {
    it('должен включать outputSchema в definition если getOutputSchema() определён', () => {
      const tool = new ToolWithOutputSchema({}, mockLogger);
      const definition = tool.getDefinition();

      expect(definition.outputSchema).toBeDefined();
      expect(definition.outputSchema!.type).toBe('object');
      expect(definition.outputSchema!.properties).toBeDefined();
    });

    it('outputSchema должен содержать корректные properties из Zod schema', () => {
      const tool = new ToolWithOutputSchema({}, mockLogger);
      const definition = tool.getDefinition();
      const props = definition.outputSchema!.properties!;

      // Проверяем что есть поля items и total
      expect(props['items']).toBeDefined();
      expect(props['total']).toBeDefined();
    });

    it('outputSchema должен содержать required поля', () => {
      const tool = new ToolWithOutputSchema({}, mockLogger);
      const definition = tool.getDefinition();

      expect(definition.outputSchema!.required).toBeDefined();
      expect(definition.outputSchema!.required).toContain('items');
      expect(definition.outputSchema!.required).toContain('total');
    });

    it('НЕ должен включать outputSchema если getOutputSchema() не определён', () => {
      const tool = new ToolWithoutOutputSchema({}, mockLogger);
      const definition = tool.getDefinition();

      expect(definition.outputSchema).toBeUndefined();
    });

    it('должен сохранять inputSchema независимо от outputSchema', () => {
      const tool = new ToolWithOutputSchema({}, mockLogger);
      const definition = tool.getDefinition();

      expect(definition.inputSchema).toBeDefined();
      expect(definition.inputSchema.type).toBe('object');
      expect(definition.inputSchema.properties['query']).toBeDefined();
    });
  });

  describe('formatSuccess() с structuredContent', () => {
    it('должен возвращать structuredContent в результате', async () => {
      const tool = new ToolWithOutputSchema({}, mockLogger);
      const result = await tool.execute({ query: 'test' });

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent!['success']).toBe(true);
      expect(result.structuredContent!['data']).toEqual({
        items: [{ id: '1', name: 'Test', score: 0.95 }],
        total: 1,
      });
    });

    it('structuredContent должен совпадать с content (JSON parsed)', async () => {
      const tool = new ToolWithOutputSchema({}, mockLogger);
      const result = await tool.execute({ query: 'test' });

      const contentParsed = JSON.parse(result.content[0]!.text);

      expect(result.structuredContent).toEqual(contentParsed);
    });

    it('tool без outputSchema НЕ должен возвращать structuredContent', async () => {
      const tool = new ToolWithoutOutputSchema({}, mockLogger);
      const result = await tool.execute({ query: 'test' });

      expect(result.structuredContent).toBeUndefined();
    });

    it('content всегда должен присутствовать (обратная совместимость)', async () => {
      const tool = new ToolWithOutputSchema({}, mockLogger);
      const result = await tool.execute({ query: 'test' });

      expect(result.content).toBeDefined();
      expect(result.content).toHaveLength(1);
      expect(result.content[0]!.type).toBe('text');
    });
  });
});
