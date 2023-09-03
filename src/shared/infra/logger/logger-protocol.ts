export interface LoggerProtocol {
  warn(log: any): void;

  error(log: any): void;

  info(log: any): void;
}
