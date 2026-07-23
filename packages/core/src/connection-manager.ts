/**
 * Connection Manager - Real-time service health monitoring
 * Detects connection issues and implements auto-reconnect with fallbacks
 */

export interface ServiceConnection {
  serviceName: string;
  status: 'connected' | 'disconnected' | 'error' | 'degraded';
  endpoint: string;
  lastChecked: Date;
  responseTime: number; // milliseconds
  uptime: number; // percentage
  errorCount: number;
  failureMessage?: string;
  fallbackServices: string[];
}

export interface ConnectionConfig {
  serviceName: string;
  endpoint: string;
  timeout: number; // milliseconds
  retryAttempts: number;
  retryDelay: number; // milliseconds
  healthCheckInterval: number; // milliseconds
  fallbacks: string[];
}

export class ConnectionManager {
  private connections: Map<string, ServiceConnection> = new Map();
  private configs: Map<string, ConnectionConfig> = new Map();
  private healthCheckIntervals: Map<string, NodeJS.Timer> = new Map();
  private readonly DEFAULT_TIMEOUT = 5000;
  private readonly DEFAULT_RETRY_ATTEMPTS = 3;

  constructor() {
    this.initializeServices();
  }

  /**
   * Initialize all critical services
   */
  private initializeServices(): void {
    const services: ConnectionConfig[] = [
      {
        serviceName: 'npm-registry',
        endpoint: 'https://registry.npmjs.org',
        timeout: 5000,
        retryAttempts: 3,
        retryDelay: 1000,
        healthCheckInterval: 30 * 60 * 1000, // 30 minutes
        fallbacks: ['yarn-registry', 'cnpm'],
      },
      {
        serviceName: 'github-api',
        endpoint: 'https://api.github.com',
        timeout: 5000,
        retryAttempts: 3,
        retryDelay: 1000,
        healthCheckInterval: 30 * 60 * 1000,
        fallbacks: ['gitlab-api', 'bitbucket-api'],
      },
      {
        serviceName: 'vercel-api',
        endpoint: 'https://api.vercel.com',
        timeout: 5000,
        retryAttempts: 2,
        retryDelay: 2000,
        healthCheckInterval: 15 * 60 * 1000, // 15 minutes
        fallbacks: ['railway-api', 'netlify-api'],
      },
      {
        serviceName: 'railway-api',
        endpoint: 'https://api.railway.app',
        timeout: 5000,
        retryAttempts: 2,
        retryDelay: 2000,
        healthCheckInterval: 15 * 60 * 1000,
        fallbacks: ['vercel-api', 'render-api'],
      },
      {
        serviceName: 'openai-api',
        endpoint: 'https://api.openai.com',
        timeout: 10000,
        retryAttempts: 3,
        retryDelay: 2000,
        healthCheckInterval: 5 * 60 * 1000, // 5 minutes
        fallbacks: ['anthropic-api', 'azure-openai'],
      },
      {
        serviceName: 'razorpay-api',
        endpoint: 'https://api.razorpay.com',
        timeout: 5000,
        retryAttempts: 3,
        retryDelay: 1000,
        healthCheckInterval: 10 * 60 * 1000, // 10 minutes
        fallbacks: ['stripe-api', 'square-api'],
      },
    ];

    services.forEach(config => {
      this.configs.set(config.serviceName, config);
      this.connections.set(config.serviceName, {
        serviceName: config.serviceName,
        status: 'disconnected',
        endpoint: config.endpoint,
        lastChecked: new Date(0),
        responseTime: 0,
        uptime: 0,
        errorCount: 0,
        fallbackServices: config.fallbacks,
      });
    });

    // Start health checks for all services
    this.startAllHealthChecks();
  }

  /**
   * Start health checks for all services
   */
  private startAllHealthChecks(): void {
    console.log('[ConnectionManager] 🏥 Starting health checks for all services...');

    this.configs.forEach(config => {
      this.startHealthCheck(config.serviceName);
    });
  }

  /**
   * Start health check for a service
   */
  private startHealthCheck(serviceName: string): void {
    const config = this.configs.get(serviceName);
    if (!config) return;

    // Initial check
    this.checkServiceHealth(serviceName);

    // Schedule periodic checks
    const timer = setInterval(() => {
      this.checkServiceHealth(serviceName);
    }, config.healthCheckInterval);

    this.healthCheckIntervals.set(serviceName, timer);
  }

  /**
   * Check service health
   */
  async checkServiceHealth(serviceName: string): Promise<boolean> {
    const connection = this.connections.get(serviceName);
    const config = this.configs.get(serviceName);

    if (!connection || !config) return false;

    console.log(`[ConnectionManager] 🔍 Checking ${serviceName}...`);

    try {
      const startTime = Date.now();

      // Perform health check (simplified)
      const response = await this.performHealthCheck(config.endpoint, config.timeout);

      const responseTime = Date.now() - startTime;

      connection.status = 'connected';
      connection.responseTime = responseTime;
      connection.lastChecked = new Date();
      connection.errorCount = 0;
      connection.failureMessage = undefined;

      console.log(`[ConnectionManager] ✅ ${serviceName} is UP (${responseTime}ms)`);

      return true;
    } catch (error) {
      connection.errorCount++;
      connection.failureMessage = String(error);

      if (connection.errorCount >= 2) {
        connection.status = 'error';
      } else {
        connection.status = 'degraded';
      }

      connection.lastChecked = new Date();

      console.warn(`[ConnectionManager] ⚠️  ${serviceName} is DOWN - Error #${connection.errorCount}`);

      // Attempt auto-reconnect
      if (connection.errorCount >= 2) {
        this.autoReconnect(serviceName);
      }

      return false;
    }
  }

  /**
   * Perform actual health check
   */
  private async performHealthCheck(endpoint: string, timeout: number): Promise<Response> {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        reject(new Error('Health check timeout'));
      }, timeout);

      fetch(endpoint, {
        method: 'GET',
        signal: controller.signal,
      })
        .then(response => {
          clearTimeout(timeoutId);
          if (response.ok) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${response.status}`));
          }
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Auto-reconnect with exponential backoff
   */
  private async autoReconnect(serviceName: string): Promise<void> {
    const config = this.configs.get(serviceName);
    if (!config) return;

    console.log(`[ConnectionManager] 🔄 Auto-reconnecting ${serviceName}...`);

    for (let attempt = 1; attempt <= config.retryAttempts; attempt++) {
      const delay = config.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff

      console.log(
        `[ConnectionManager] Retry attempt ${attempt}/${config.retryAttempts} in ${delay}ms...`
      );

      await new Promise(resolve => setTimeout(resolve, delay));

      const success = await this.checkServiceHealth(serviceName);
      if (success) {
        console.log(`[ConnectionManager] ✅ Reconnected to ${serviceName}`);
        return;
      }
    }

    // All retry attempts failed - try fallback
    console.error(`[ConnectionManager] ❌ Could not reconnect to ${serviceName} after retries`);
    this.tryFallbackService(serviceName);
  }

  /**
   * Try fallback service
   */
  private tryFallbackService(serviceName: string): void {
    const connection = this.connections.get(serviceName);
    if (!connection || connection.fallbackServices.length === 0) {
      console.error(`[ConnectionManager] ❌ No fallback services available for ${serviceName}`);
      return;
    }

    const fallback = connection.fallbackServices[0];
    console.log(
      `[ConnectionManager] 🔀 Switching to fallback: ${serviceName} → ${fallback}`
    );

    // Alert user/system
    this.alertServiceFailure(serviceName, fallback);
  }

  /**
   * Alert service failure
   */
  private alertServiceFailure(serviceName: string, fallback: string): void {
    console.error(
      `[ConnectionManager] 🚨 ALERT: ${serviceName} is down, using fallback: ${fallback}`
    );

    // In production, this would send alerts via:
    // - Email
    // - Slack
    // - PagerDuty
    // - Dashboard notifications
  }

  /**
   * Get all service statuses
   */
  getAllServiceStatuses(): ServiceConnection[] {
    return Array.from(this.connections.values());
  }

  /**
   * Get service status
   */
  getServiceStatus(serviceName: string): ServiceConnection | undefined {
    return this.connections.get(serviceName);
  }

  /**
   * Get all connected services
   */
  getConnectedServices(): ServiceConnection[] {
    return Array.from(this.connections.values()).filter(c => c.status === 'connected');
  }

  /**
   * Get disconnected services
   */
  getDisconnectedServices(): ServiceConnection[] {
    return Array.from(this.connections.values()).filter(c => c.status !== 'connected');
  }

  /**
   * Calculate system health
   */
  getSystemHealth(): {
    totalServices: number;
    connectedServices: number;
    disconnectedServices: number;
    healthPercentage: number;
  } {
    const all = this.connections.size;
    const connected = this.getConnectedServices().length;
    const disconnected = all - connected;
    const healthPercentage = (connected / all) * 100;

    return {
      totalServices: all,
      connectedServices: connected,
      disconnectedServices: disconnected,
      healthPercentage: Math.round(healthPercentage),
    };
  }

  /**
   * Stop all health checks
   */
  stopAllHealthChecks(): void {
    console.log('[ConnectionManager] 🛑 Stopping all health checks...');
    this.healthCheckIntervals.forEach(timer => clearInterval(timer));
    this.healthCheckIntervals.clear();
  }

  /**
   * Get connection statistics
   */
  getStatistics(): {
    averageResponseTime: number;
    averageUptime: number;
    totalErrors: number;
    lastCheckTime: Date;
  } {
    const connections = Array.from(this.connections.values());
    const avgResponseTime =
      connections.reduce((sum, c) => sum + c.responseTime, 0) / connections.length;
    const avgUptime = connections.reduce((sum, c) => sum + c.uptime, 0) / connections.length;
    const totalErrors = connections.reduce((sum, c) => sum + c.errorCount, 0);
    const lastCheck = new Date(
      Math.max(...connections.map(c => c.lastChecked.getTime()))
    );

    return {
      averageResponseTime: Math.round(avgResponseTime),
      averageUptime: Math.round(avgUptime),
      totalErrors,
      lastCheckTime: lastCheck,
    };
  }
}

export default ConnectionManager;
