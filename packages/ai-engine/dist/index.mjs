// src/config.ts
var ConfigurationManager = class {
  config;
  constructor(customConfig) {
    this.config = {
      defaultProvider: process.env.AI_PROVIDER || "openai",
      defaultModel: process.env.AI_MODEL || "gpt-4o",
      maxTokens: Number(process.env.AI_MAX_TOKENS) || 2048,
      temperature: Number(process.env.AI_TEMPERATURE) || 0.7,
      logLevel: process.env.AI_LOG_LEVEL || "info",
      apiKeyOpenAI: process.env.OPENAI_API_KEY,
      apiKeyGemini: process.env.GEMINI_API_KEY,
      apiKeyClaude: process.env.ANTHROPIC_API_KEY,
      apiKeyGrok: process.env.GROK_API_KEY,
      apiKeyDeepSeek: process.env.DEEPSEEK_API_KEY,
      apiKeyOpenRouter: process.env.OPENROUTER_API_KEY,
      ollamaUrl: process.env.OLLAMA_URL || "http://localhost:11434",
      ...customConfig
    };
  }
  getConfig() {
    return this.config;
  }
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
};
var Logger = class {
  level;
  constructor(level = "info") {
    this.level = level;
  }
  shouldLog(msgLevel) {
    const levels = ["debug", "info", "warn", "error"];
    return levels.indexOf(msgLevel) >= levels.indexOf(this.level);
  }
  debug(message, context) {
    if (this.shouldLog("debug")) {
      console.log(
        `[AI-ENGINE] [DEBUG] ${message}`,
        context ? JSON.stringify(context) : ""
      );
    }
  }
  info(message, context) {
    if (this.shouldLog("info")) {
      console.log(
        `[AI-ENGINE] [INFO] ${message}`,
        context ? JSON.stringify(context) : ""
      );
    }
  }
  warn(message, context) {
    if (this.shouldLog("warn")) {
      console.warn(
        `[AI-ENGINE] [WARN] ${message}`,
        context ? JSON.stringify(context) : ""
      );
    }
  }
  error(message, error) {
    if (this.shouldLog("error")) {
      console.error(
        `[AI-ENGINE] [ERROR] ${message}`,
        error ? JSON.stringify(error) : ""
      );
    }
  }
};
var logger = new Logger();

// src/providers.ts
var OpenAIProvider = class {
  name = "openai";
  supportedModels = ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"];
  async complete(req) {
    logger.debug("Executing completion with OpenAI Driver", {
      model: req.model
    });
    return {
      provider: this.name,
      model: req.model,
      content: `[OpenAI Response] Standard simulation completion text answering your user message.`,
      usage: { promptTokens: 42, completionTokens: 85, totalTokens: 127 }
    };
  }
};
var GeminiProvider = class {
  name = "gemini";
  supportedModels = ["gemini-1.5-pro", "gemini-1.5-flash"];
  async complete(req) {
    logger.debug("Executing completion with Google Gemini Driver", {
      model: req.model
    });
    return {
      provider: this.name,
      model: req.model,
      content: `[Gemini Response] Highly advanced prompt completion answering user intent.`,
      usage: { promptTokens: 30, completionTokens: 60, totalTokens: 90 }
    };
  }
};
var ClaudeProvider = class {
  name = "claude";
  supportedModels = ["claude-3-5-sonnet", "claude-3-opus", "claude-3-haiku"];
  async complete(req) {
    logger.debug("Executing completion with Anthropic Claude Driver", {
      model: req.model
    });
    return {
      provider: this.name,
      model: req.model,
      content: `[Claude Response] Impeccable reasoning and detailed code explainer response text.`,
      usage: { promptTokens: 50, completionTokens: 110, totalTokens: 160 }
    };
  }
};
var GrokProvider = class {
  name = "grok";
  supportedModels = ["grok-beta", "grok-1.5-vision"];
  async complete(req) {
    logger.debug("Executing completion with xAI Grok Driver", {
      model: req.model
    });
    return {
      provider: this.name,
      model: req.model,
      content: `[Grok Response] Direct, witty, and real-time optimized reply to user parameters.`,
      usage: { promptTokens: 35, completionTokens: 75, totalTokens: 110 }
    };
  }
};
var DeepSeekProvider = class {
  name = "deepseek";
  supportedModels = ["deepseek-chat", "deepseek-coder"];
  async complete(req) {
    logger.debug("Executing completion with DeepSeek Driver", {
      model: req.model
    });
    return {
      provider: this.name,
      model: req.model,
      content: `[DeepSeek Response] Highly performant specialized code synthesis output.`,
      usage: { promptTokens: 25, completionTokens: 100, totalTokens: 125 }
    };
  }
};
var OpenRouterProvider = class {
  name = "openrouter";
  supportedModels = ["openrouter/meta-llama-3-70b", "openrouter/mistral-large"];
  async complete(req) {
    logger.debug("Executing completion with OpenRouter Endpoint", {
      model: req.model
    });
    return {
      provider: this.name,
      model: req.model,
      content: `[OpenRouter Response] Proxied completion returned via third-party open-source backend.`,
      usage: { promptTokens: 40, completionTokens: 90, totalTokens: 130 }
    };
  }
};
var OllamaProvider = class {
  name = "ollama";
  supportedModels = ["llama3", "mistral", "phi3"];
  async complete(req) {
    logger.debug("Executing completion with Local Ollama Node", {
      model: req.model
    });
    return {
      provider: this.name,
      model: req.model,
      content: `[Local Ollama Response] Fully offline edge model phi3/llama3 response content.`,
      usage: { promptTokens: 15, completionTokens: 45, totalTokens: 60 }
    };
  }
};
var UnifiedAIClient = class {
  providers = /* @__PURE__ */ new Map();
  constructor() {
    this.registerProvider(new OpenAIProvider());
    this.registerProvider(new GeminiProvider());
    this.registerProvider(new ClaudeProvider());
    this.registerProvider(new GrokProvider());
    this.registerProvider(new DeepSeekProvider());
    this.registerProvider(new OpenRouterProvider());
    this.registerProvider(new OllamaProvider());
  }
  registerProvider(provider) {
    this.providers.set(provider.name, provider);
  }
  /**
   * Intelligently routes and resolves prompt completions based on model routing requirements.
   */
  async execute(req) {
    const targetModel = req.model.toLowerCase();
    let routedProvider;
    for (const provider of this.providers.values()) {
      if (provider.supportedModels.some(
        (m) => targetModel.includes(m) || m.includes(targetModel)
      )) {
        routedProvider = provider;
        break;
      }
    }
    if (!routedProvider) {
      logger.warn(
        `Model "${req.model}" not explicitly matched. Routing to default fallback: openai (gpt-4o)`
      );
      routedProvider = this.providers.get("openai");
      req.model = "gpt-4o";
    }
    try {
      return await routedProvider.complete(req);
    } catch (err) {
      logger.error(
        `Routed Provider "${routedProvider.name}" failed! Re-routing to emergency fallback OpenAI...`,
        err
      );
      const fallback = this.providers.get("openai");
      return await fallback.complete({
        ...req,
        model: "gpt-4o"
      });
    }
  }
};
var unifiedAIClient = new UnifiedAIClient();

// src/prompts.ts
var PromptManager = class {
  templates = /* @__PURE__ */ new Map();
  constructor() {
    this.seed();
  }
  seed() {
    this.registerTemplate({
      id: "mentor-default",
      name: "Standard AI Mentor",
      systemTemplate: "You are an elite software mentor. Guide the user step-by-step.",
      userTemplate: "Help me debug this block of code:\n\n```{{language}}\n{{code}}\n```\n\nError received: {{error}}"
    });
    this.registerTemplate({
      id: "curriculum-builder",
      name: "Syllabus Creator",
      systemTemplate: "You are an educational syllabus coordinator. Generate clean markdown lists.",
      userTemplate: "Create an optimized {{difficulty}} learning path for studying {{topic}}."
    });
  }
  registerTemplate(tpl) {
    this.templates.set(tpl.id, tpl);
  }
  getTemplate(id) {
    return this.templates.get(id);
  }
  /**
   * Replaces prompt variables inside templates with real inputs.
   */
  compile(templateId, variables) {
    const tpl = this.getTemplate(templateId);
    if (!tpl) {
      throw new Error(`Prompt template "${templateId}" not found.`);
    }
    let compiledUser = tpl.userTemplate;
    for (const [key, value] of Object.entries(variables)) {
      compiledUser = compiledUser.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    return [
      { role: "system", content: tpl.systemTemplate },
      { role: "user", content: compiledUser }
    ];
  }
};
var ContextManager = class {
  maxTokens;
  constructor(maxTokens = 4096) {
    this.maxTokens = maxTokens;
  }
  /**
   * Approximates token usage of chat history (standard 1 token ~ 4 chars approximation).
   */
  estimateTokens(messages) {
    let characters = 0;
    for (const msg of messages) {
      characters += msg.content.length;
    }
    return Math.ceil(characters / 4);
  }
  /**
   * Dynamically prunes oldest conversations to fit into the max context token budget.
   */
  fitContext(messages) {
    const systemMessages = messages.filter((m) => m.role === "system");
    const otherMessages = messages.filter((m) => m.role !== "system");
    const prunedOtherMessages = [...otherMessages];
    while (prunedOtherMessages.length > 0) {
      const estimatedTotal = this.estimateTokens([
        ...systemMessages,
        ...prunedOtherMessages
      ]);
      if (estimatedTotal <= this.maxTokens) {
        break;
      }
      prunedOtherMessages.shift();
    }
    return [...systemMessages, ...prunedOtherMessages];
  }
};
var promptManager = new PromptManager();

// src/memory.ts
var MemoryEngine = class {
  facts = [];
  /**
   * Learns a specific historical study fact or credential.
   */
  memorize(topic, fact) {
    this.facts.push({
      id: "fact-" + Math.random().toString(36).substring(2, 9),
      topic: topic.toLowerCase(),
      fact,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  /**
   * Retrieves relevant saved memories matching a keyphrase query.
   */
  query(keyphrase) {
    const term = keyphrase.toLowerCase();
    return this.facts.filter(
      (f) => f.topic.includes(term) || f.fact.toLowerCase().includes(term)
    );
  }
  clear() {
    this.facts = [];
  }
};
var ConversationSession = class {
  id;
  history = [];
  constructor(id) {
    this.id = id;
  }
  addMessage(role, content) {
    this.history.push({ role, content });
  }
  getHistory() {
    return [...this.history];
  }
  setHistory(newHistory) {
    this.history = [...newHistory];
  }
  clear() {
    this.history = [];
  }
};
var ConversationManager = class {
  sessions = /* @__PURE__ */ new Map();
  getOrCreateSession(sessionId) {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = new ConversationSession(sessionId);
      this.sessions.set(sessionId, session);
    }
    return session;
  }
  deleteSession(sessionId) {
    return this.sessions.delete(sessionId);
  }
};
var memoryEngine = new MemoryEngine();
var conversationManager = new ConversationManager();

// src/plugins.ts
var ToolRegistry = class {
  tools = /* @__PURE__ */ new Map();
  registerTool(tool) {
    this.tools.set(tool.name, tool);
  }
  getTool(name) {
    return this.tools.get(name);
  }
  getToolDefinitionsList() {
    return Array.from(this.tools.values()).map(
      ({ name, description, parameters }) => ({
        name,
        description,
        parameters
      })
    );
  }
  /**
   * Safe execution of tool calls with complete catch fallbacks.
   */
  async invoke(name, argsString) {
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
};
var PluginLoader = class {
  loadedPlugins = /* @__PURE__ */ new Map();
  registry;
  constructor(registry) {
    this.registry = registry;
  }
  load(plugin) {
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
  getLoadedPlugins() {
    return Array.from(this.loadedPlugins.values());
  }
};
var toolRegistry = new ToolRegistry();
var pluginLoader = new PluginLoader(toolRegistry);

// src/agent.ts
var TaskQueue = class {
  queue = [];
  enqueue(name, payload) {
    const task = {
      id: "task-" + Math.random().toString(36).substring(2, 9),
      name,
      status: "pending",
      payload
    };
    this.queue.push(task);
    return task;
  }
  getTasks() {
    return [...this.queue];
  }
  getPendingTask() {
    return this.queue.find((t) => t.status === "pending");
  }
  updateStatus(taskId, status, result, error) {
    const task = this.queue.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      if (result !== void 0) task.result = result;
      if (error !== void 0) task.error = error;
    }
  }
  clear() {
    this.queue = [];
  }
};
var AgentRuntime = class {
  queue = new TaskQueue();
  isRunning = false;
  getQueue() {
    return this.queue;
  }
  /**
   * Dispatches task into task queue and triggers the asynchronous runner loop.
   */
  submitTask(name, payload) {
    const task = this.queue.enqueue(name, payload);
    logger.info(`Submitted Agent task: ${name}`, { taskId: task.id });
    this.triggerScheduler();
    return task;
  }
  triggerScheduler() {
    if (this.isRunning) return;
    this.isRunning = true;
    setTimeout(async () => {
      await this.runSchedulerLoop();
    }, 0);
  }
  async runSchedulerLoop() {
    logger.debug("Starting Agent Task Scheduler Loop...");
    let task = this.queue.getPendingTask();
    while (task) {
      this.queue.updateStatus(task.id, "processing");
      logger.info(`Running task: ${task.name} (${task.id})`);
      try {
        const result = await this.executeAgentReasoning(task);
        this.queue.updateStatus(task.id, "completed", result);
        logger.info(`Task completed successfully: ${task.id}`);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        this.queue.updateStatus(task.id, "failed", void 0, errMsg);
        logger.error(`Task failed: ${task.id}`, err);
      }
      task = this.queue.getPendingTask();
    }
    this.isRunning = false;
    logger.debug("Agent Task Scheduler Loop finished.");
  }
  /**
   * Simulated Agent Reasoning Loop with Tool Fallbacks.
   */
  async executeAgentReasoning(task) {
    const messages = [
      {
        role: "system",
        content: "You are a task-resolving agent runner. Reason step-by-step."
      },
      {
        role: "user",
        content: `Please execute this instruction: ${task.name} with payload ${JSON.stringify(task.payload)}`
      }
    ];
    const response = await unifiedAIClient.execute({
      model: "gpt-4o",
      messages
    });
    if (task.payload && task.payload.requestedTool) {
      const toolName = task.payload.requestedTool;
      const toolArgs = JSON.stringify(task.payload.arguments || {});
      logger.info(`Agent invoking tool request: ${toolName}`, {
        args: toolArgs
      });
      const toolOutput = await toolRegistry.invoke(toolName, toolArgs);
      return {
        aiCompletion: response.content,
        toolInvocation: {
          name: toolName,
          output: toolOutput
        }
      };
    }
    return {
      aiCompletion: response.content
    };
  }
};
var agentRuntime = new AgentRuntime();
export {
  AgentRuntime,
  ClaudeProvider,
  ConfigurationManager,
  ContextManager,
  ConversationManager,
  ConversationSession,
  DeepSeekProvider,
  GeminiProvider,
  GrokProvider,
  Logger,
  MemoryEngine,
  OllamaProvider,
  OpenAIProvider,
  OpenRouterProvider,
  PluginLoader,
  PromptManager,
  TaskQueue,
  ToolRegistry,
  UnifiedAIClient,
  agentRuntime,
  conversationManager,
  logger,
  memoryEngine,
  pluginLoader,
  promptManager,
  toolRegistry,
  unifiedAIClient
};
