import { ChatMessage } from './providers.js';

// -----------------------------------------------------------------------------
// Prompt Management Engine
// -----------------------------------------------------------------------------

export interface SystemPromptTemplate {
  id: string;
  name: string;
  systemTemplate: string;
  userTemplate: string;
}

export class PromptManager {
  private templates: Map<string, SystemPromptTemplate> = new Map();

  constructor() {
    // Seed default mentoring prompts
    this.seed();
  }

  private seed() {
    this.registerTemplate({
      id: 'mentor-default',
      name: 'Standard AI Mentor',
      systemTemplate:
        'You are an elite software mentor. Guide the user step-by-step.',
      userTemplate:
        'Help me debug this block of code:\n\n```{{language}}\n{{code}}\n```\n\nError received: {{error}}',
    });

    this.registerTemplate({
      id: 'curriculum-builder',
      name: 'Syllabus Creator',
      systemTemplate:
        'You are an educational syllabus coordinator. Generate clean markdown lists.',
      userTemplate:
        'Create an optimized {{difficulty}} learning path for studying {{topic}}.',
    });
  }

  public registerTemplate(tpl: SystemPromptTemplate): void {
    this.templates.set(tpl.id, tpl);
  }

  public getTemplate(id: string): SystemPromptTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * Replaces prompt variables inside templates with real inputs.
   */
  public compile(
    templateId: string,
    variables: Record<string, string>
  ): ChatMessage[] {
    const tpl = this.getTemplate(templateId);
    if (!tpl) {
      throw new Error(`Prompt template "${templateId}" not found.`);
    }

    let compiledUser = tpl.userTemplate;
    for (const [key, value] of Object.entries(variables)) {
      compiledUser = compiledUser.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return [
      { role: 'system', content: tpl.systemTemplate },
      { role: 'user', content: compiledUser },
    ];
  }
}

// -----------------------------------------------------------------------------
// Sliding Context Window Manager
// -----------------------------------------------------------------------------

export class ContextManager {
  private maxTokens: number;

  constructor(maxTokens = 4096) {
    this.maxTokens = maxTokens;
  }

  /**
   * Approximates token usage of chat history (standard 1 token ~ 4 chars approximation).
   */
  public estimateTokens(messages: ChatMessage[]): number {
    let characters = 0;
    for (const msg of messages) {
      characters += msg.content.length;
    }
    return Math.ceil(characters / 4);
  }

  /**
   * Dynamically prunes oldest conversations to fit into the max context token budget.
   */
  public fitContext(messages: ChatMessage[]): ChatMessage[] {
    // System messages are crucial and must NEVER be pruned!
    const systemMessages = messages.filter((m) => m.role === 'system');
    let otherMessages = messages.filter(m => m.role !== 'system');

    while (otherMessages.length > 0) {
      const estimatedTotal = this.estimateTokens([
        ...systemMessages,
        ...otherMessages,
      ]);
      if (estimatedTotal <= this.maxTokens) {
        break;
      }
      // Evict the oldest user/assistant thread pair
      otherMessages.shift();
    }

    return [...systemMessages, ...otherMessages];
  }
}

export const promptManager = new PromptManager();
