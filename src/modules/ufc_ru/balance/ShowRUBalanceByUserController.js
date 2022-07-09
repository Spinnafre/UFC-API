class ShowRUBalanceByUserController{
    constructor(showRUBalanceByUserUseCase){
        this.showRUBalanceByUserUseCase=showRUBalanceByUserUseCase
    }
    async handle(req,res,next){
        try {
            const {card_number,registry_number}=req.query
            const result=await this.showRUBalanceByUserUseCase.execute(card_number,registry_number)
            return res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }
}

module.exports={
    ShowRUBalanceByUserController
}