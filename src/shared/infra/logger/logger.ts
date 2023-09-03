export class Logger {
  private static loggerConfig = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "numeric",
  };
  static warn(log: any) {
    console.log(
      `[WARNING] - ${Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        second: "numeric",
      }).format(Date.now())} - ${log}`
    );
  }
  static info(log: any) {
    console.log(
      `[INFO] - ${Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        second: "numeric",
      }).format(Date.now())} - ${log}`
    );
  }
  static error(log: any) {
    console.log(
      `[ERROR] - ${Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        second: "numeric",
      }).format(Date.now())} - ${log}`
    );
  }
}
