class LogRepository {
  add(log: string, logType: string) {
    return new Promise((resolve, reject) => {
      console.log(`Adding log of type ${logType} where value is ${log}`);
      return setTimeout(resolve, 2000);
    });
  }
}
