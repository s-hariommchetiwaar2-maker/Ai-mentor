// -----------------------------------------------------------------------------
// Central Configuration & Struct Logging Manager
// -----------------------------------------------------------------------------

export interface AIEngineConfig {
  defaultProvider: string;
  defaultModel: string;
  maxTokens: number;
  temperature: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  apiKeyOpenAI?: string;
  apiKeyGemini?: string;
  apiKeyClaude?: string;
  apiKeyGrok?: string;
  apiKeyDeepSeek?: string;
  apiKeyOpenRouter?: string;
  ollamaUrl?: string;
}

export class ConfigurationManager {
  private config: AIEngineConfig;

  constructor(customConfig?: Partial<AIEngineConfig>) {
    this.config = {
      defaultProvider: process.env.AI_PROVIDER || 'openai',
      defaultModel: process.env.AI_MODEL || 'gpt-4o',
      maxTokens: Number(process.env.AI_MAX_TOKENS) || 2048,
      temperature: Number(process.env.AI_TEMPERATURE) || 0.7,
      logLevel: (process.env.AI_LOG_LEVEL as any) || 'info',
      apiKeyOpenAI: process.env.OPENAI_API_KEY,
      apiKeyGemini: process.env.GEMINI_API_KEY,
      apiKeyClaude: process.env.ANTHROPIC_API_KEY,
      apiKeyGrok: process.env.GROK_API_KEY,
      apiKeyDeepSeek: process.env.DEEPSEEK_API_KEY,
      apiKeyOpenRouter: process.env.OPENROUTER_API_KEY,
      ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
      ...customConfig,
    };
  }

  public getConfig(): AIEngineConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<AIEngineConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export class Logger {
  private level: 'debug' | 'info' | 'warn' | 'error';

  constructor(level: 'debug' | 'info' | 'warn' | 'error' = 'info') {
    this.level = level;
  }

  private shouldLog(msgLevel: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(msgLevel) >= levels.indexOf(this.level);
  }

  public debug(message: string, context?: unknown): void {
    if (this.shouldLog('debug')) {
      console.log(
        `[AI-ENGINE] [DEBUG] ${message}`,
        context ? JSON.stringify(context) : ''
      );
    }
  }

  public info(message: string, context?: unknown): void {
    if (this.shouldLog('info')) {
      console.log(
        `[AI-ENGINE] [INFO] ${message}`,
        context ? JSON.stringify(context) : ''
      );
    }
  }

  public warn(message: string, context?: unknown): void {
    if (this.shouldLog('warn')) {
      console.warn(
        `[AI-ENGINE] [WARN] ${message}`,
        context ? JSON.stringify(context) : ''
      );
    }
  }

  public error(message: string, error?: unknown): void {
    if (this.shouldLog('error')) {
      console.error(
        `[AI-ENGINE] [ERROR] ${message}`,
        error ? JSON.stringify(error) : ''
      );
    }
  }
}

export const logger = new Logger();
