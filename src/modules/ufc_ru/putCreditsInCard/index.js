const { PutCreditsInCardController} = require("./putCreditsInCardController")
const { PutCreditsInCardUseCase } = require("./putCreditsInCard")
const puppeteer = require('puppeteer');

module.exports=()=>{
    const useCase=new PutCreditsInCardUseCase(puppeteer)
    const controller=new PutCreditsInCardController(useCase)
    return controller
}