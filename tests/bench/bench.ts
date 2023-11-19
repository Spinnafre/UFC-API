"use strict";

import "dotenv/config";
import autocannon from "autocannon";
import { Logger } from "../../src/shared/infra/logger/logger";
import app from "../../src/main/http/app";

const server = app.listen(3333, () => {
  Logger.info(`[Benchmark mode] Server listening in port 3333`);
  startBench();
});

function startBench() {
  const baseURL = `http://localhost:${server.address().port}`;

  const instance = autocannon(
    {
      url: `${baseURL}/api/v1/news/all?pageNumber=1&title=livros&domain=biblioteca.ufc.br

`,
      connections: 1, //default
      pipelining: 1, // default
      duration: 20, // default
      workers: 1,
      connectionRate: 10,
      overallRate: 10,
    },
    finishedBench
  );

  autocannon.track(instance);

  process.once("SIGINT", () => {
    console.log("Finishing test");
    instance.stop();
  });

  function finishedBench(err: any, res: any) {
    console.log("finished bench", err, res);
    server.close();
    process.exit(0);
  }
}
