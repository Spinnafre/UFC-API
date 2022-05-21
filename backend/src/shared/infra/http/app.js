const UFCNewsRouter=require('./routes/UFCNews.routes')
const RURouter=require('./routes/RU.routes')

const app=require("express")()
const puppeteer = require('puppeteer')
const { removeBlanksLines } = require('../../../../utils/removeBlanksLines')

app.use('/news',UFCNewsRouter)
app.use('/ru_ufc',RURouter)
// https://puppeteer.github.io/puppeteer/docs/puppeteer.elementhandle/

module.exports={
    app
}