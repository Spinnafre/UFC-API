const UFCNewsRouter=require('./routes/UFCNews.routes')
const RURouter=require('./routes/RU.routes')

// https://puppeteer.github.io/puppeteer/docs
const app=require("express")()

app.use('/news',UFCNewsRouter)
app.use('/ru_ufc',RURouter)

module.exports={
    app
}