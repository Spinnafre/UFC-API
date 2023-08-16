const {ShowHighlightsNewsController } = require("./showHighlightNewsController")
const { ShowHighlightsNewsUseCase } = require("./showHighlightsNewsUseCase")

const puppeteer = require('puppeteer');
module.exports=()=>{
    const showHighlightsNewsUseCase=new ShowHighlightsNewsUseCase(puppeteer)
    const showHighlightsNewsController=new ShowHighlightsNewsController(showHighlightsNewsUseCase)
    return showHighlightsNewsController
}