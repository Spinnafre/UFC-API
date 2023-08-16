const { ShowNewsController } = require("./showNewsController")
const { ShowNewsUseCase } = require("./showNewsUseCase")
const puppeteer = require('puppeteer');

module.exports=()=>{
    const showNewsUseCase=new ShowNewsUseCase(puppeteer)
    const showNewsController=new ShowNewsController(showNewsUseCase)
    return showNewsController
}