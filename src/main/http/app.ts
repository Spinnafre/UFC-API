import "dotenv/config";

import { handleError } from "../../shared/errors/handler";

import express from "express";
import { setupRoutes } from "./routes/setup-routes";

const app = express();
app.use(express.json());

setupRoutes(app);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(async (err: any, req: any, res: any, next: any) => {
  await handleError(err, res);
});

// process.on("uncaughtException", (err) => {
//   handleError(err);
// });

process.on("SIGTERM", () => {
  console.log("Processo terminado com sucesso");
});

export default app;
