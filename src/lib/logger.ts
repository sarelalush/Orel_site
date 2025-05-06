import { z } from 'zod';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };

    this.logs.push(entry);

    // Keep logs under maxLogs limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, data || '');
    }
  }

  public debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  public info(message: string, data?: any) {
    this.log('info', message, data);
  }

  public warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  public error(message: string, data?: any) {
    this.log('error', message, data);
  }

  public getLogs(level?: LogLevel): LogEntry[] {
    return level ? this.logs.filter(log => log.level === level) : this.logs;
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();