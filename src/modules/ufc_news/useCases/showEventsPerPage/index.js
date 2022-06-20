const { ShowEventsPerPageUseCase } = require("./showEventsPerPage")
const { ShowEventsPerPageController } = require("./showEventsPerPageController")

module.exports=()=>{
    const useCase=new ShowEventsPerPageUseCase()
    const controller=new ShowEventsPerPageController(useCase)
    return controller
}