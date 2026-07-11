# @ai-mentor/ai-engine

The central LLM routing and Agent runtime orchestration package for the **AI Mentor** platform.

---

## 🏛️ AI Engine Architectures

This package orchestrates advanced artificial intelligence processes, memory context windows, and tool actions:

1. **Multi-AI Provider Layer**: Supports standard adapters for:
   - OpenAI (gpt-4o, gpt-4-turbo)
   - Google Gemini (gemini-1.5-pro, gemini-1.5-flash)
   - Anthropic Claude (claude-3-5-sonnet, claude-3-opus)
   - xAI Grok (grok-beta)
   - DeepSeek (deepseek-chat, deepseek-coder)
   - OpenRouter Endpoint (meta-llama, mistral)
   - Local Ollama Node (offline phi3, llama3)
2. **Unified API Client**: Abstracted request completion parameters.
3. **Dynamic Model Routing System**: Automatically matches model identifiers to their optimal driver client with failover emergency routing.
4. **Prompt Management Engine**: Supports system templates, placeholder compile utilities, and dynamic values replacements.
5. **Sliding Context Window Manager**: Dynamically manages message history length to respect LLM token budget windows.
6. **Memory Engine & Conversation Manager**: Vector-like query matches for learning historical user facts.
7. **Tool Calling & Plugin Loaders**: Standardized function calling definitions with automated arguments parsing.
8. **Agent Runtime**: Task scheduler with asynchronous in-memory queues and execution loops.

---

## 🧪 Testing

Run automated tests checking multi-AI model routing, prompt compiles, sliding context truncation, custom plugins, and agent task execution:

```bash
pnpm test
```

The test verifies zero logical compilation errors.
