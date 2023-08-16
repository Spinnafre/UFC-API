const {GetAllNewsController} = require("./showAllNewsController")
const {ShowAllNewsUseCase} = require("./showAllNews")
const puppeteer = require('puppeteer');


module.exports=()=>{
    const getProinterNews=new ShowAllNewsUseCase(puppeteer)
    const controller=new  GetAllNewsController(getProinterNews)
    return controller
}