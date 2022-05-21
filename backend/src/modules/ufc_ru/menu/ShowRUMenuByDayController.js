class ShowMenuController{
    constructor(showMenuUseCase){
        this.showMenuUseCase=showMenuUseCase
    }
    async handle(req,res){
        try {
            const {day}=req.query
            const result=await this.showMenuUseCase.execute(day)
            return res.status(200).json(result)
        } catch (error) {
            return res.status(400).json({
                msg:error.message
            })
        }
    }
}

module.exports={
    ShowMenuController
}