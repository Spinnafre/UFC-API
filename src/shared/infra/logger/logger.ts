class LogObserver {
  private logRepository: any;

  constructor(logRepository: any) {
    this.logRepository = logRepository;
  }

  private logs: Map<"warning" | "success" | "errors", Array<string>> = new Map([
    ["warning", []],
    ["success", []],
    ["errors", []],
  ]);

  private observers = {
    warning: (log: string) => {
      console.log(
        `[WARNING] - ${Intl.DateTimeFormat("pt-BR").format(
          Date.now()
        )} - ${log}`
      );
    },
    success: (log: string) => {
      console.log(
        `[SUCCESS] - ${Intl.DateTimeFormat("pt-BR").format(
          Date.now()
        )} - ${log}`
      );
    },
    errors: (log: string) => {
      console.log(
        `[ERROR] - ${Intl.DateTimeFormat("pt-BR").format(Date.now())} - ${log}`
      );
    },
  };

  async notify() {
    for (let [logType, logs] of this.logs.entries()) {
      if (logs.length) {
        let log = null;

        do {
          log = logs.pop();

          if (log) {
            this.observers[logType](log);
            await this.logRepository.add(log);
          }
        } while (log);
      }
    }
  }

  addLog(logType: "warning" | "success" | "errors", log: string) {
    this.logs.get(logType)?.push(log);
  }

  getLogs() {
    return [...this.logs.values()];
  }
}
