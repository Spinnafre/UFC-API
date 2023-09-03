import pino from "pino";
import serverConfig from "../../../main/config/server";
export class Logger {
  private static logger = pino({
    level: serverConfig.logsLevels,
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
  static warn(log: any) {
    this.logger.warn(log);
  }
  static info(log: any) {
    this.logger.info(log);
  }
  static error(log: any) {
    this.logger.error(log);
  }
}
