const { ShowNewsController } = require("./showNewsController")
const { ShowNewsUseCase } = require("./showNewsUseCase")


module.exports=()=>{
    const showNewsUseCase=new ShowNewsUseCase()
    const showNewsController=new ShowNewsController(showNewsUseCase)
    return showNewsController
}