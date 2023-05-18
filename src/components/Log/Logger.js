export class ConsoleLogger {
  const log;
  const warn;
  const error;

  constructor() {
    this.log = console.log.bind(console);
    this.warn = console.warn.bind(console);
    this.error = console.error.bind(console);
  }
}/** Logger which outputs to the browser console */
export class ConsoleLogger implements Logger {
  readonly log: LogFn;
  readonly warn: LogFn;
  readonly error: LogFn;

  constructor() {
    this.log = console.log.bind(console);
    this.warn = console.warn.bind(console);
    this.error = console.error.bind(console);
  }
}
