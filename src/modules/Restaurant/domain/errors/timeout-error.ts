export class TimeoutError extends Error {
  constructor(timer: number) {
    super(`Timeout, time of execution has exceeded ${timer}`);
    this.name = "TimeoutError";
  }
}
