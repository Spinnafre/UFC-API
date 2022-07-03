const { ShowContestsAndSelectionsController } = require("./showContestAndSelectionsController")
const { ShowContestsAndSelectionsUseCase } = require("./showContestsAndSelections")


module.exports=()=>{
    const showContestsAndSelectionsUseCase=new ShowContestsAndSelectionsUseCase()
    const showContestsAndSelectionsController=new ShowContestsAndSelectionsController(showContestsAndSelectionsUseCase)
    return showContestsAndSelectionsController
}