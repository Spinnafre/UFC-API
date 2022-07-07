const {GetAllNewsController} = require("./showAllNewsController")
const {ShowAllNewsUseCase} = require("./showAllNews")


module.exports=()=>{
    const getProinterNews=new ShowAllNewsUseCase()
    const controller=new  GetAllNewsController(getProinterNews)
    return controller
}