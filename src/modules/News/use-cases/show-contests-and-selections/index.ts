const { ShowContestsAndSelectionsController } = require("./showContestAndSelectionsController")
const { ShowContestsAndSelectionsUseCase } = require("./showContestsAndSelections")
const puppeteer = require('puppeteer');

module.exports=()=>{
    const showContestsAndSelectionsUseCase=new ShowContestsAndSelectionsUseCase(puppeteer)
    const showContestsAndSelectionsController=new ShowContestsAndSelectionsController(showContestsAndSelectionsUseCase)
    return showContestsAndSelectionsController
}