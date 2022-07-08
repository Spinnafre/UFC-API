const { ShowRUBalanceByUserController} = require("./ShowRUBalanceByUserController")
const { ShowRUBalanceByUserUseCase } = require("./ShowRUBalanceByUserUseCase")
const puppeteer = require('puppeteer');

module.exports=()=>{
    const useCase=new ShowRUBalanceByUserUseCase(puppeteer)
    const controller=new ShowRUBalanceByUserController(useCase)
    return controller
}