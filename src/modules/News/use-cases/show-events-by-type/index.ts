const { ShowFilteredEventsUseCase } = require("./showFilteredEvents")
const { ShowFilteredEventsController } = require("./showFilteredEventsController")
const puppeteer = require('puppeteer');

module.exports=()=>{
    const useCase=new ShowFilteredEventsUseCase(puppeteer)
    const controller=new ShowFilteredEventsController(useCase)
    return controller
}