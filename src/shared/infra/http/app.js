require('dotenv/config')
const UFCNewsRouter = require("./routes/UFCNews.routes");
const RURouter = require("./routes/RU.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../../../swagger.json");


const { handleError } = require("../../errors/AppErrors");
const { port } = require("../../../config/server");

const express=require("express");

const app = express();
app.use(express.json());



app.use("/news", UFCNewsRouter);
app.use("/ru_ufc", RURouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(async(err,req,res,next)=>{
  await handleError(err,res)
})

//Não deixar heroku pôr o app para dormir
setInterval(function() {
  let http;
  //Desenvolvimento
  if(process.env.NODE_ENV){
    http=require('http')
    http.get(`http://localhost:${port}/news/ping`)
    console.log(`Checking if app is running`)
  }else{
    http=require('https')
    http.get('https://ufcity.herokuapp.com/news/ping')
    console.log(`Checking if app is running`)
  }
}, 10000); // every 5 minutes (300000)


process.on('uncaughtException',(err)=>{
  handleError(err)
})

process.on('SIGTERM',()=>{
  console.log('Processo terminado com sucesso')
})

module.exports = {
  app,
};
