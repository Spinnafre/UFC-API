import "dotenv/config";

import { Logger } from "../../shared/infra/logger/logger";
import { serverConfig } from "../config";
import app from "./app";

const server = app.listen(serverConfig.port, () => {
  Logger.info(`Server listening in port ${serverConfig.port}`);
});

process.on("uncaughtException", (error) => {
  Logger.error(error);

  server.close();

  process.exit(1);
});

process.on("SIGTERM", () => {
  Logger.info("Processo terminado com sucesso");
});
