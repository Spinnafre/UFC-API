const UFCNewsRouter = require("./routes/UFCNews.routes");
const RURouter = require("./routes/RU.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../../../swagger.json");

const http=require('http')

const express=require("express")
const app = express();
app.use(express.json());

app.use("/news", UFCNewsRouter);
app.use("/ru_ufc", RURouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

//Não deixar heroku pôr o app para dormir
setInterval(function() {
  http.get('http://localhost:8080/news/ping')
}, 300000); // every 5 minutes (300000)

process.on('uncaughtException',(err)=>{
  console.log('Erro na execução da aplicação - ',err)
})

module.exports = {
  app,
};
