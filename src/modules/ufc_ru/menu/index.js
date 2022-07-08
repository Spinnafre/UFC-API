const { ShowMenuController } = require("./ShowRUMenuByDayController")
const { ShowRUMenuByDayUseCase } = require("./ShowRUMenuByDayUseCase")
const puppeteer = require('puppeteer');


module.exports=()=>{
    const showRUMenuUseCase=new ShowRUMenuByDayUseCase(puppeteer)
    const showRUMenuController=new ShowMenuController(showRUMenuUseCase)
    return showRUMenuController
}