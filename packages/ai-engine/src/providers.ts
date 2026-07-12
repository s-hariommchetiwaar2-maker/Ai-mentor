import { logger } from './config.js';

// -----------------------------------------------------------------------------
// Unified Multi-Provider Chat API Interfaces
// -----------------------------------------------------------------------------

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  tools?: any[];
}

export interface ChatCompletionResponse {
  provider: string;
  model: string;
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  toolCalls?: {
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }[];
}

// -----------------------------------------------------------------------------
// AI Provider Drivers
// -----------------------------------------------------------------------------

export interface AIProvider {
  name: string;
  supportedModels: string[];
  complete: (req: ChatCompletionRequest) => Promise<ChatCompletionResponse>;
}

export class OpenAIProvider implements AIProvider {
  name = 'openai';
  supportedModels = ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];

  async complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    logger.debug('Executing completion with OpenAI Driver', {
      model: req.model,
    });
    // Simulate API Response with real payload structures
    return {
      provider: this.name,
      model: req.model,
      content: `[OpenAI Response] Standard simulation completion text answering your user message.`,
      usage: { promptTokens: 42, completionTokens: 85, totalTokens: 127 },
    };
  }
}

export class GeminiProvider implements AIProvider {
  name = 'gemini';
  supportedModels = ['gemini-1.5-pro', 'gemini-1.5-flash'];

  async complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    logger.debug('Executing completion with Google Gemini Driver', {
      model: req.model,
    });
    return {
      provider: this.name,
      model: req.model,
      content: `[Gemini Response] Highly advanced prompt completion answering user intent.`,
      usage: { promptTokens: 30, completionTokens: 60, totalTokens: 90 },
    };
  }
}

export class ClaudeProvider implements AIProvider {
  name = 'claude';
  supportedModels = ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-haiku'];

  async complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    logger.debug('Executing completion with Anthropic Claude Driver', {
      model: req.model,
    });
    return {
      provider: this.name,
      model: req.model,
      content: `[Claude Response] Impeccable reasoning and detailed code explainer response text.`,
      usage: { promptTokens: 50, completionTokens: 110, totalTokens: 160 },
    };
  }
}

export class GrokProvider implements AIProvider {
  name = 'grok';
  supportedModels = ['grok-beta', 'grok-1.5-vision'];

  async complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    logger.debug('Executing completion with xAI Grok Driver', {
      model: req.model,
    });
    return {
      provider: this.name,
      model: req.model,
      content: `[Grok Response] Direct, witty, and real-time optimized reply to user parameters.`,
      usage: { promptTokens: 35, completionTokens: 75, totalTokens: 110 },
    };
  }
}

export class DeepSeekProvider implements AIProvider {
  name = 'deepseek';
  supportedModels = ['deepseek-chat', 'deepseek-coder'];

  async complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    logger.debug('Executing completion with DeepSeek Driver', {
      model: req.model,
    });
    return {
      provider: this.name,
      model: req.model,
      content: `[DeepSeek Response] Highly performant specialized code synthesis output.`,
      usage: { promptTokens: 25, completionTokens: 100, totalTokens: 125 },
    };
  }
}

export class OpenRouterProvider implements AIProvider {
  name = 'openrouter';
  supportedModels = ['openrouter/meta-llama-3-70b', 'openrouter/mistral-large'];

  async complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    logger.debug('Executing completion with OpenRouter Endpoint', {
      model: req.model,
    });
    return {
      provider: this.name,
      model: req.model,
      content: `[OpenRouter Response] Proxied completion returned via third-party open-source backend.`,
      usage: { promptTokens: 40, completionTokens: 90, totalTokens: 130 },
    };
  }
}

export class OllamaProvider implements AIProvider {
  name = 'ollama';
  supportedModels = ['llama3', 'mistral', 'phi3'];

  async complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    logger.debug('Executing completion with Local Ollama Node', {
      model: req.model,
    });
    return {
      provider: this.name,
      model: req.model,
      content: `[Local Ollama Response] Fully offline edge model phi3/llama3 response content.`,
      usage: { promptTokens: 15, completionTokens: 45, totalTokens: 60 },
    };
  }
}

// -----------------------------------------------------------------------------
// Dynamic Model Routing System & Unified Client
// -----------------------------------------------------------------------------

export class UnifiedAIClient {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    this.registerProvider(new OpenAIProvider());
    this.registerProvider(new GeminiProvider());
    this.registerProvider(new ClaudeProvider());
    this.registerProvider(new GrokProvider());
    this.registerProvider(new DeepSeekProvider());
    this.registerProvider(new OpenRouterProvider());
    this.registerProvider(new OllamaProvider());
  }

  public registerProvider(provider: AIProvider): void {
    this.providers.set(provider.name, provider);
  }

  /**
   * Intelligently routes and resolves prompt completions based on model routing requirements.
   */
  public async execute(
    req: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const targetModel = req.model.toLowerCase();

    // Intelligently route depending on model substring matches
    let routedProvider: AIProvider | undefined;

    for (const provider of this.providers.values()) {
      if (
        provider.supportedModels.some(
          (m) => targetModel.includes(m) || m.includes(targetModel)
        )
      ) {
        routedProvider = provider;
        break;
      }
    }

    // Default Fallback Routing
    if (!routedProvider) {
      logger.warn(
        `Model "${req.model}" not explicitly matched. Routing to default fallback: openai (gpt-4o)`
      );
      routedProvider = this.providers.get('openai')!;
      req.model = 'gpt-4o';
    }

    try {
      return await routedProvider.complete(req);
    } catch (err) {
      logger.error(
        `Routed Provider "${routedProvider.name}" failed! Re-routing to emergency fallback OpenAI...`,
        err
      );
      const fallback = this.providers.get('openai')!;
      return await fallback.complete({
        ...req,
        model: 'gpt-4o',
      });
    }
  }
}

export const unifiedAIClient = new UnifiedAIClient();
