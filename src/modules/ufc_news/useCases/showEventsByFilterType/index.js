const { ShowFilteredEventsUseCase } = require("./showFilteredEvents")
const { ShowFilteredEventsController } = require("./showFilteredEventsController")

module.exports=()=>{
    const useCase=new ShowFilteredEventsUseCase()
    const controller=new ShowFilteredEventsController(useCase)
    return controller
}