const { ShowEventsPerPageUseCase } = require("./showEventsPerPage")
const { ShowEventsPerPageController } = require("./showEventsPerPageController")
const puppeteer = require('puppeteer');

module.exports=()=>{
    const useCase=new ShowEventsPerPageUseCase(puppeteer)
    const controller=new ShowEventsPerPageController(useCase)
    return controller
}