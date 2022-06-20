const { ShowMenuController } = require("./ShowRUMenuByDayController")
const { ShowRUMenuByDayUseCase } = require("./ShowRUMenuByDayUseCase")


module.exports=()=>{
    const showRUMenuUseCase=new ShowRUMenuByDayUseCase()
    const showRUMenuController=new ShowMenuController(showRUMenuUseCase)
    return showRUMenuController
}