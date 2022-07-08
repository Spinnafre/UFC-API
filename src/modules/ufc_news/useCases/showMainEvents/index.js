const {ShowHighlightsEventsUseCase} =require("./showEventsInfoUseCase")
const {ShowHighlightsEventsController} =require("./showEventsInfoController")
const puppeteer = require('puppeteer');

module.exports=()=>{
    const useCase=new ShowHighlightsEventsUseCase(puppeteer)
    const controller=new ShowHighlightsEventsController(useCase)
    return controller
}