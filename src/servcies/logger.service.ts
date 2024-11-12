import { injectable } from "inversify";
import { ILogger } from "../types/logger";
import path from "path";
import fs from "fs";

@injectable()
export default class LoggerService implements ILogger {
  private logFile: string;
  private colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  };

  constructor() {
    this.logFile = path.join(process.cwd(), "app.log");
  }

  private writeToFile(content: string): void {
    fs.appendFile(this.logFile, content, (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    });
  }

  private getCallerMethodName(): string {
    const error = new Error();
    const stackLines = error.stack ? error.stack.split('\n') : [];
    const callerLine = stackLines[4];
    const methodName = callerLine.match(/at (\w+)\.?/)?.[1] || 'Unknown';

    return methodName;
  }

  private getColorForLevel(level: string): string {
    switch (level) {
      case 'info':
        return this.colors.green;
      case 'warn':
        return this.colors.yellow;
      case 'error':
        return this.colors.red;
      case 'debug':
        return this.colors.cyan;
      default:
        return this.colors.white;
    }
  }

  private log(
    level: "info" | "warn" | "error" | "debug",
    message: string,
    meta?: any
  ): void {
    const timestamp = new Date().toISOString();
    const color = this.getColorForLevel(level);
    const metaString = meta ? JSON.stringify(meta) : "";
    const callerMethod = this.getCallerMethodName()
    
    const consoleMessage = `${timestamp} ${color} [${callerMethod}] ${message}${this.colors.reset} ${metaString ? metaString + '\n' : '\n'}`;
    const fileMessage = `${timestamp} [${level.toUpperCase()}] ${message} ${metaString}\n`;

    console.log(consoleMessage);
    this.writeToFile(fileMessage);
  }

  info(message: string, meta?: any): void {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: any): void {
    this.log("error", message, meta);
  }

  debug(message: string, meta?: any): void {
    this.log("debug", message, meta);
  }
}
