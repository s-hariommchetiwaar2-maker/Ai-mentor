// -----------------------------------------------------------------------------
// Tool Calling Framework
// -----------------------------------------------------------------------------

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<
      string,
      { type: string; description: string; enum?: string[] }
    >;
    required: string[];
  };
  execute: (args: Record<string, any>) => Promise<string> | string;
}

export class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();

  public registerTool(tool: ToolDefinition): void {
    this.tools.set(tool.name, tool);
  }

  public getTool(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  public getToolDefinitionsList(): Omit<ToolDefinition, 'execute'>[] {
    return Array.from(this.tools.values()).map(
      ({ name, description, parameters }) => ({
        name,
        description,
        parameters,
      })
    );
  }

  /**
   * Safe execution of tool calls with complete catch fallbacks.
   */
  public async invoke(name: string, argsString: string): Promise<string> {
    const tool = this.getTool(name);
    if (!tool) {
      throw new Error(`Tool "${name}" is not registered in this system.`);
    }

    try {
      const parsedArgs = JSON.parse(argsString);
      return await tool.execute(parsedArgs);
    } catch (err) {
      return `[Tool Error] Execution of function "${name}" failed: ${err instanceof Error ? err.message : String(err)}`;
    }
  }
}

// -----------------------------------------------------------------------------
// Plugin Loading System
// -----------------------------------------------------------------------------

export interface AIEnginePlugin {
  id: string;
  name: string;
  onLoad: (registry: ToolRegistry) => void;
}

export class PluginLoader {
  private loadedPlugins: Map<string, AIEnginePlugin> = new Map();
  private registry: ToolRegistry;

  constructor(registry: ToolRegistry) {
    this.registry = registry;
  }

  public load(plugin: AIEnginePlugin): void {
    if (this.loadedPlugins.has(plugin.id)) {
      console.warn(`Plugin "${plugin.name}" is already loaded.`);
      return;
    }

    plugin.onLoad(this.registry);
    this.loadedPlugins.set(plugin.id, plugin);
    console.log(
      `[AI-ENGINE] Custom plugin "${plugin.name}" loaded successfully.`
    );
  }

  public getLoadedPlugins(): AIEnginePlugin[] {
    return Array.from(this.loadedPlugins.values());
  }
}

export const toolRegistry = new ToolRegistry();
export const pluginLoader = new PluginLoader(toolRegistry);
