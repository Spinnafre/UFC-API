const UFCNewsRouter=require('./routes/UFCNews.routes')
const RURouter=require('./routes/RU.routes')
const swaggerUi=require("swagger-ui-express")
const swaggerFile=require("../../../swagger.json")

// https://puppeteer.github.io/puppeteer/docs
const app=require("express")()

app.use('/news',UFCNewsRouter)
app.use('/ru_ufc',RURouter)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports={
    app
}