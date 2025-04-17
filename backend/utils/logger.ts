
/**
 * Logger utility for standardized logging across the backend
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Logger interface for consistent logging functionality
 */
export interface ILogger {
  debug(message: string, meta?: Record<string, any>): void;
  info(message: string, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  error(message: string, meta?: Record<string, any>): void;
}

/**
 * Simple logger implementation that outputs to console
 * In production, this could be replaced with a more robust solution
 */
class ConsoleLogger implements ILogger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, meta?: Record<string, any>): void {
    const timestamp = this.getTimestamp();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    console[level === 'debug' ? 'log' : level](`[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`);
  }

  public debug(message: string, meta?: Record<string, any>): void {
    this.log('debug', message, meta);
  }

  public info(message: string, meta?: Record<string, any>): void {
    this.log('info', message, meta);
  }

  public warn(message: string, meta?: Record<string, any>): void {
    this.log('warn', message, meta);
  }

  public error(message: string, meta?: Record<string, any>): void {
    this.log('error', message, meta);
  }
}

/**
 * Singleton instance of the logger
 */
export const logger: ILogger = new ConsoleLogger();
