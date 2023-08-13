require("dotenv/config");
const UFCNewsRouter = require("./routes/UFCNews.routes");
const RURouter = require("./routes/RU.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../../../swagger.json");

const { handleError } = require("../../errors/AppErrors");
const { port } = require("../../../config/server");

const express = require("express");

const app = express();
app.use(express.json());

app.use("/news", UFCNewsRouter);
app.use("/ru_ufc", RURouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(async (err, req, res, next) => {
  await handleError(err, res);
});

process.on("uncaughtException", (err) => {
  handleError(err);
});

process.on("SIGTERM", () => {
  console.log("Processo terminado com sucesso");
});

module.exports = {
  app,
};
