import assert from 'assert';
import { unifiedAIClient } from './providers.js';
import { promptManager, ContextManager } from './prompts.js';
import { memoryEngine } from './memory.js';
import { toolRegistry, pluginLoader } from './plugins.js';
import { agentRuntime } from './agent.js';

async function runAIEngineTests() {
  console.log('Running AI Mentor Core Engine Test Suite...');

  // ---------------------------------------------------------------------------
  // Test 1: Multi-AI Provider model routing fallback mechanics
  // ---------------------------------------------------------------------------
  const req1 = {
    model: 'claude-3-5-sonnet',
    messages: [{ role: 'user' as const, content: 'Test Claude' }],
  };
  const res1 = await unifiedAIClient.execute(req1);
  assert.strictEqual(
    res1.provider,
    'claude',
    'Claude model should route to Claude driver'
  );
  assert.match(
    res1.content,
    /Claude Response/,
    'Content should return Claude response'
  );

  const reqFallback = {
    model: 'non-existent-exotic-model',
    messages: [{ role: 'user' as const, content: 'Test Fallback' }],
  };
  const resFallback = await unifiedAIClient.execute(reqFallback);
  assert.strictEqual(
    resFallback.provider,
    'openai',
    'Exotic models should route to OpenAI default fallback'
  );

  // ---------------------------------------------------------------------------
  // Test 2: Prompt Manager replacements of placeholders
  // ---------------------------------------------------------------------------
  const compiled = promptManager.compile('mentor-default', {
    language: 'rust',
    code: 'let x: i32 = "hello";',
    error: 'mismatched types',
  });
  assert.strictEqual(compiled[0].role, 'system');
  assert.match(compiled[1].content, /Help me debug this block of code:/);
  assert.match(compiled[1].content, /rust/);
  assert.match(compiled[1].content, /let x: i32 = "hello";/);
  assert.match(compiled[1].content, /mismatched types/);

  // ---------------------------------------------------------------------------
  // Test 3: Sliding Context Windows fitting token budget
  // ---------------------------------------------------------------------------
  const ctx = new ContextManager(100); // 100 estimated tokens max budget (~400 characters)
  const conversation = [
    { role: 'system' as const, content: 'Crucial system prompt' },
    {
      role: 'user' as const,
      content:
        'A extremely long filler conversation statement that goes on and on and on and on'.repeat(
          5
        ),
    },
    { role: 'assistant' as const, content: 'Short reply' },
  ];
  const fitted = ctx.fitContext(conversation);
  assert.strictEqual(
    fitted[0].role,
    'system',
    'System prompt should NEVER be pruned'
  );
  assert.ok(
    fitted.length < conversation.length,
    'Old conversational items should be sliding pruned'
  );

  // ---------------------------------------------------------------------------
  // Test 4: Memory Engine learn & recall facts
  // ---------------------------------------------------------------------------
  memoryEngine.clear();
  memoryEngine.memorize(
    'Rust lifetimes',
    'Struct lifetimes ensure variables do not point to deleted scopes.'
  );
  memoryEngine.memorize(
    'Node.js streams',
    'Readable streams push buffers down sequential pipelines.'
  );

  const results = memoryEngine.query('lifetimes');
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].topic, 'rust lifetimes');

  // ---------------------------------------------------------------------------
  // Test 5: Tool Registry framework and plugin loaders
  // ---------------------------------------------------------------------------
  toolRegistry.registerTool({
    name: 'calculate_sum',
    description: 'Computes sum of numbers',
    parameters: {
      type: 'object',
      properties: {
        a: { type: 'number', description: 'first number' },
        b: { type: 'number', description: 'second number' },
      },
      required: ['a', 'b'],
    },
    execute: (args) => String(Number(args.a) + Number(args.b)),
  });

  const sumRes = await toolRegistry.invoke(
    'calculate_sum',
    JSON.stringify({ a: 15, b: 27 })
  );
  assert.strictEqual(
    sumRes,
    '42',
    'Tool sum computation must yield correct arithmetic output'
  );

  // Test custom plugin loaders
  pluginLoader.load({
    id: 'test-plugin',
    name: 'Math Plugin Pack',
    onLoad: (registry) => {
      registry.registerTool({
        name: 'multiply',
        description: 'Multiplies inputs',
        parameters: {
          type: 'object',
          properties: { x: { type: 'number', description: 'first' } },
          required: ['x'],
        },
        execute: (args) => String(Number(args.x) * 2),
      });
    },
  });
  const plugins = pluginLoader.getLoadedPlugins();
  assert.strictEqual(plugins.length, 1);
  assert.strictEqual(plugins[0].name, 'Math Plugin Pack');

  // ---------------------------------------------------------------------------
  // Test 6: Agent tasks queue dispatch scheduler loop
  // ---------------------------------------------------------------------------
  const runtimeQueue = agentRuntime.getQueue();
  runtimeQueue.clear();

  const task = agentRuntime.submitTask('Perform system assessment', {
    requestedTool: 'calculate_sum',
    arguments: { a: 10, b: 30 },
  });

  assert.strictEqual(
    task.status,
    'pending',
    'Submitted task should start as pending'
  );

  // Await task completion in asynchronous scheduler loop
  await new Promise((resolve) => setTimeout(resolve, 100));

  const updatedTask = runtimeQueue.getTasks().find((t) => t.id === task.id);
  assert.ok(updatedTask);
  assert.strictEqual(
    updatedTask.status,
    'completed',
    'Task should finish with completed status'
  );
  assert.strictEqual(updatedTask.result?.toolInvocation?.output, '40');

  console.log('✓ All AI Mentor Core Engine Tests Passed successfully!');
}

runAIEngineTests().catch((err) => {
  console.error('✗ Core Engine Test failure:', err);
  process.exit(1);
});
