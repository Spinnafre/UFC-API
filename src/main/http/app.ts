import { handleError } from "../../shared/errors/handler";
import express from "express";
import { setupRoutes } from "./routes/setup-routes";
import { Logger } from "../../shared/infra/logger/logger";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
app.use(express.json());

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(async (err: any, req: any, res: any, next: any) => {
  await handleError(err, res);
});

app.use(helmet());
app.use(
  morgan(
    ":date[iso] :remote-addr :remote-user :method :url :status :res[content-length] - :response-time ms"
  )
);

setupRoutes(app);
// process.on("uncaughtException", (err) => {
//   handleError(err);
// });

process.on("SIGTERM", () => {
  Logger.info("Processo terminado com sucesso");
});

export default app;
