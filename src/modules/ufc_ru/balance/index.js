const { ShowRUBalanceByUserController} = require("./ShowRUBalanceByUserController")
const { ShowRUBalanceByUserUseCase } = require("./ShowRUBalanceByUserUseCase")


module.exports=()=>{
    const useCase=new ShowRUBalanceByUserUseCase()
    const controller=new ShowRUBalanceByUserController(useCase)
    return controller
}