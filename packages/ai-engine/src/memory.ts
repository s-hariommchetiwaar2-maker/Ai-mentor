import { ChatMessage } from './providers.js';

// -----------------------------------------------------------------------------
// Memory Engine (Vector/Semantic-like Keyphrase Search)
// -----------------------------------------------------------------------------

export interface MemoryFact {
  id: string;
  topic: string;
  fact: string;
  createdAt: string;
}

export class MemoryEngine {
  private facts: MemoryFact[] = [];

  /**
   * Learns a specific historical study fact or credential.
   */
  public memorize(topic: string, fact: string): void {
    this.facts.push({
      id: 'fact-' + Math.random().toString(36).substring(2, 9),
      topic: topic.toLowerCase(),
      fact,
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Retrieves relevant saved memories matching a keyphrase query.
   */
  public query(keyphrase: string): MemoryFact[] {
    const term = keyphrase.toLowerCase();
    return this.facts.filter(
      (f) => f.topic.includes(term) || f.fact.toLowerCase().includes(term)
    );
  }

  public clear(): void {
    this.facts = [];
  }
}

// -----------------------------------------------------------------------------
// Conversation Manager
// -----------------------------------------------------------------------------

export class ConversationSession {
  public id: string;
  private history: ChatMessage[] = [];

  constructor(id: string) {
    this.id = id;
  }

  public addMessage(
    role: 'system' | 'user' | 'assistant',
    content: string
  ): void {
    this.history.push({ role, content });
  }

  public getHistory(): ChatMessage[] {
    return [...this.history];
  }

  public setHistory(newHistory: ChatMessage[]): void {
    this.history = [...newHistory];
  }

  public clear(): void {
    this.history = [];
  }
}

export class ConversationManager {
  private sessions: Map<string, ConversationSession> = new Map();

  public getOrCreateSession(sessionId: string): ConversationSession {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = new ConversationSession(sessionId);
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  public deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }
}

export const memoryEngine = new MemoryEngine();
export const conversationManager = new ConversationManager();
