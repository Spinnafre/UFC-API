import pino from "pino";
import { serverConfig } from "../../../main/config";

const logger = pino({
  level: serverConfig.logsLevels,
  enabled: serverConfig.logsEnabled,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
    bindings: (bindings) => {
      return {
        proccess_id: bindings.pid,
        host: bindings.hostname,
        node_version: process.version,
      };
    },
  },
  timestamp: () =>
    `, "timestamp":"${Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "numeric",
    }).format(Date.now())}"`,
  transport: {
    target: "pino-pretty",
    options: {
      levelFirst: true,
      ignore: "node_version, host",
      singleLine: true,
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      customPrettifiers: {},
    },
  },
});
export class Logger {
  static warn(log: any) {
    logger.warn(log);
  }
  static info(log: any) {
    logger.info(log);
  }
  static error(log: any) {
    logger.error(log);
  }
}
