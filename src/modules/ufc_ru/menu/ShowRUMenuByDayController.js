class ShowMenuController{
    constructor(showMenuUseCase){
        this.showMenuUseCase=showMenuUseCase
    }
    async handle(req,res,next){
        try {
            const {day}=req.query
            const result=await this.showMenuUseCase.execute(day)
            return res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }
}

module.exports={
    ShowMenuController
}