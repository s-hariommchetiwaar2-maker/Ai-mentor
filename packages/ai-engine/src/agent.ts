import { unifiedAIClient, ChatMessage } from './providers.js';
import { toolRegistry } from './plugins.js';
import { logger } from './config.js';

// -----------------------------------------------------------------------------
// In-Memory Queue System
// -----------------------------------------------------------------------------

export interface AgentTask {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payload: any;
  result?: any;
  error?: string;
}

export class TaskQueue {
  private queue: AgentTask[] = [];

  public enqueue(name: string, payload: any): AgentTask {
    const task: AgentTask = {
      id: 'task-' + Math.random().toString(36).substring(2, 9),
      name,
      status: 'pending',
      payload,
    };
    this.queue.push(task);
    return task;
  }

  public getTasks(): AgentTask[] {
    return [...this.queue];
  }

  public getPendingTask(): AgentTask | undefined {
    return this.queue.find((t) => t.status === 'pending');
  }

  public updateStatus(
    taskId: string,
    status: AgentTask['status'],
    result?: any,
    error?: string
  ): void {
    const task = this.queue.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      if (result !== undefined) task.result = result;
      if (error !== undefined) task.error = error;
    }
  }

  public clear(): void {
    this.queue = [];
  }
}

// -----------------------------------------------------------------------------
// Agent Runtime & Task Scheduler Loop
// -----------------------------------------------------------------------------

export class AgentRuntime {
  private queue = new TaskQueue();
  private isRunning = false;

  public getQueue(): TaskQueue {
    return this.queue;
  }

  /**
   * Dispatches task into task queue and triggers the asynchronous runner loop.
   */
  public submitTask(name: string, payload: any): AgentTask {
    const task = this.queue.enqueue(name, payload);
    logger.info(`Submitted Agent task: ${name}`, { taskId: task.id });

    // Auto-trigger scheduler loop
    this.triggerScheduler();
    return task;
  }

  private triggerScheduler() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Run asynchronously
    setTimeout(async () => {
      await this.runSchedulerLoop();
    }, 0);
  }

  private async runSchedulerLoop() {
    logger.debug('Starting Agent Task Scheduler Loop...');

    let task = this.queue.getPendingTask();
    while (task) {
      this.queue.updateStatus(task.id, 'processing');
      logger.info(`Running task: ${task.name} (${task.id})`);

      try {
        const result = await this.executeAgentReasoning(task);
        this.queue.updateStatus(task.id, 'completed', result);
        logger.info(`Task completed successfully: ${task.id}`);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        this.queue.updateStatus(task.id, 'failed', undefined, errMsg);
        logger.error(`Task failed: ${task.id}`, err);
      }

      task = this.queue.getPendingTask();
    }

    this.isRunning = false;
    logger.debug('Agent Task Scheduler Loop finished.');
  }

  /**
   * Simulated Agent Reasoning Loop with Tool Fallbacks.
   */
  private async executeAgentReasoning(task: AgentTask): Promise<any> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a task-resolving agent runner. Reason step-by-step.',
      },
      {
        role: 'user',
        content: `Please execute this instruction: ${task.name} with payload ${JSON.stringify(task.payload)}`,
      },
    ];

    // AI compilation check
    const response = await unifiedAIClient.execute({
      model: 'gpt-4o',
      messages,
    });

    // If payload contains specific tool invocation requests, run them
    if (task.payload && task.payload.requestedTool) {
      const toolName = task.payload.requestedTool;
      const toolArgs = JSON.stringify(task.payload.arguments || {});
      logger.info(`Agent invoking tool request: ${toolName}`, {
        args: toolArgs,
      });
      const toolOutput = await toolRegistry.invoke(toolName, toolArgs);
      return {
        aiCompletion: response.content,
        toolInvocation: {
          name: toolName,
          output: toolOutput,
        },
      };
    }

    return {
      aiCompletion: response.content,
    };
  }
}

export const agentRuntime = new AgentRuntime();
