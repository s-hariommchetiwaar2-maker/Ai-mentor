interface AIEngineConfig {
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
declare class ConfigurationManager {
    private config;
    constructor(customConfig?: Partial<AIEngineConfig>);
    getConfig(): AIEngineConfig;
    updateConfig(newConfig: Partial<AIEngineConfig>): void;
}
declare class Logger {
    private level;
    constructor(level?: 'debug' | 'info' | 'warn' | 'error');
    private shouldLog;
    debug(message: string, context?: unknown): void;
    info(message: string, context?: unknown): void;
    warn(message: string, context?: unknown): void;
    error(message: string, error?: unknown): void;
}
declare const logger: Logger;

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
interface ChatCompletionRequest {
    model: string;
    messages: ChatMessage[];
    temperature?: number;
    maxTokens?: number;
    tools?: any[];
}
interface ChatCompletionResponse {
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
interface AIProvider {
    name: string;
    supportedModels: string[];
    complete: (req: ChatCompletionRequest) => Promise<ChatCompletionResponse>;
}
declare class OpenAIProvider implements AIProvider {
    name: string;
    supportedModels: string[];
    complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}
declare class GeminiProvider implements AIProvider {
    name: string;
    supportedModels: string[];
    complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}
declare class ClaudeProvider implements AIProvider {
    name: string;
    supportedModels: string[];
    complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}
declare class GrokProvider implements AIProvider {
    name: string;
    supportedModels: string[];
    complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}
declare class DeepSeekProvider implements AIProvider {
    name: string;
    supportedModels: string[];
    complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}
declare class OpenRouterProvider implements AIProvider {
    name: string;
    supportedModels: string[];
    complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}
declare class OllamaProvider implements AIProvider {
    name: string;
    supportedModels: string[];
    complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}
declare class UnifiedAIClient {
    private providers;
    constructor();
    registerProvider(provider: AIProvider): void;
    /**
     * Intelligently routes and resolves prompt completions based on model routing requirements.
     */
    execute(req: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}
declare const unifiedAIClient: UnifiedAIClient;

interface SystemPromptTemplate {
    id: string;
    name: string;
    systemTemplate: string;
    userTemplate: string;
}
declare class PromptManager {
    private templates;
    constructor();
    private seed;
    registerTemplate(tpl: SystemPromptTemplate): void;
    getTemplate(id: string): SystemPromptTemplate | undefined;
    /**
     * Replaces prompt variables inside templates with real inputs.
     */
    compile(templateId: string, variables: Record<string, string>): ChatMessage[];
}
declare class ContextManager {
    private maxTokens;
    constructor(maxTokens?: number);
    /**
     * Approximates token usage of chat history (standard 1 token ~ 4 chars approximation).
     */
    estimateTokens(messages: ChatMessage[]): number;
    /**
     * Dynamically prunes oldest conversations to fit into the max context token budget.
     */
    fitContext(messages: ChatMessage[]): ChatMessage[];
}
declare const promptManager: PromptManager;

interface MemoryFact {
    id: string;
    topic: string;
    fact: string;
    createdAt: string;
}
declare class MemoryEngine {
    private facts;
    /**
     * Learns a specific historical study fact or credential.
     */
    memorize(topic: string, fact: string): void;
    /**
     * Retrieves relevant saved memories matching a keyphrase query.
     */
    query(keyphrase: string): MemoryFact[];
    clear(): void;
}
declare class ConversationSession {
    id: string;
    private history;
    constructor(id: string);
    addMessage(role: 'system' | 'user' | 'assistant', content: string): void;
    getHistory(): ChatMessage[];
    setHistory(newHistory: ChatMessage[]): void;
    clear(): void;
}
declare class ConversationManager {
    private sessions;
    getOrCreateSession(sessionId: string): ConversationSession;
    deleteSession(sessionId: string): boolean;
}
declare const memoryEngine: MemoryEngine;
declare const conversationManager: ConversationManager;

interface ToolDefinition {
    name: string;
    description: string;
    parameters: {
        type: 'object';
        properties: Record<string, {
            type: string;
            description: string;
            enum?: string[];
        }>;
        required: string[];
    };
    execute: (args: Record<string, any>) => Promise<string> | string;
}
declare class ToolRegistry {
    private tools;
    registerTool(tool: ToolDefinition): void;
    getTool(name: string): ToolDefinition | undefined;
    getToolDefinitionsList(): Omit<ToolDefinition, 'execute'>[];
    /**
     * Safe execution of tool calls with complete catch fallbacks.
     */
    invoke(name: string, argsString: string): Promise<string>;
}
interface AIEnginePlugin {
    id: string;
    name: string;
    onLoad: (registry: ToolRegistry) => void;
}
declare class PluginLoader {
    private loadedPlugins;
    private registry;
    constructor(registry: ToolRegistry);
    load(plugin: AIEnginePlugin): void;
    getLoadedPlugins(): AIEnginePlugin[];
}
declare const toolRegistry: ToolRegistry;
declare const pluginLoader: PluginLoader;

interface AgentTask {
    id: string;
    name: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    payload: any;
    result?: any;
    error?: string;
}
declare class TaskQueue {
    private queue;
    enqueue(name: string, payload: any): AgentTask;
    getTasks(): AgentTask[];
    getPendingTask(): AgentTask | undefined;
    updateStatus(taskId: string, status: AgentTask['status'], result?: any, error?: string): void;
    clear(): void;
}
declare class AgentRuntime {
    private queue;
    private isRunning;
    getQueue(): TaskQueue;
    /**
     * Dispatches task into task queue and triggers the asynchronous runner loop.
     */
    submitTask(name: string, payload: any): AgentTask;
    private triggerScheduler;
    private runSchedulerLoop;
    /**
     * Simulated Agent Reasoning Loop with Tool Fallbacks.
     */
    private executeAgentReasoning;
}
declare const agentRuntime: AgentRuntime;

export { type AIEngineConfig, type AIEnginePlugin, type AIProvider, AgentRuntime, type AgentTask, type ChatCompletionRequest, type ChatCompletionResponse, type ChatMessage, ClaudeProvider, ConfigurationManager, ContextManager, ConversationManager, ConversationSession, DeepSeekProvider, GeminiProvider, GrokProvider, Logger, MemoryEngine, type MemoryFact, OllamaProvider, OpenAIProvider, OpenRouterProvider, PluginLoader, PromptManager, type SystemPromptTemplate, TaskQueue, type ToolDefinition, ToolRegistry, UnifiedAIClient, agentRuntime, conversationManager, logger, memoryEngine, pluginLoader, promptManager, toolRegistry, unifiedAIClient };
