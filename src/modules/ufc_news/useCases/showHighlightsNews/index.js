const {ShowHighlightsNewsController } = require("./showHighlightNewsController")
const { ShowHighlightsNewsUseCase } = require("./showHighlightsNewsUseCase")


module.exports=()=>{
    const showHighlightsNewsUseCase=new ShowHighlightsNewsUseCase()
    const showHighlightsNewsController=new ShowHighlightsNewsController(showHighlightsNewsUseCase)
    return showHighlightsNewsController
}