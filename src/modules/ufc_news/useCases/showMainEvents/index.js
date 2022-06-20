const {ShowHighlightsEventsUseCase} =require("./showEventsInfoUseCase")
const {ShowHighlightsEventsController} =require("./showEventsInfoController")

module.exports=()=>{
    const useCase=new ShowHighlightsEventsUseCase()
    const controller=new ShowHighlightsEventsController(useCase)
    return controller
}