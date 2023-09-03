import { Logger } from "../../shared/infra/logger/logger";
import serverConfig from "../config/server";
import app from "./app";

app.listen(serverConfig.port, () => {
  Logger.info(`Server listening in port ${serverConfig.port}`);
});
