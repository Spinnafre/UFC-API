import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { handleError } from "../../shared/errors/handler";
import { setupRoutes } from "./routes/setup-routes";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./api-docs/swagger.json";

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.json());
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

export default app;
