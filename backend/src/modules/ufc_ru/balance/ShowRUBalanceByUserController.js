class ShowRUBalanceByUserController{
    constructor(showRUBalanceByUserUseCase){
        this.showRUBalanceByUserUseCase=showRUBalanceByUserUseCase
    }
    async handle(req,res){
        try {
            const {card_number,registry_number}=req.query
            const result=await this.showRUBalanceByUserUseCase.execute(card_number,registry_number)
            return res.status(200).json(result)
        } catch (error) {
            return res.status(400).json({
                msg:error.message
            })
        }
    }
}

module.exports={
    ShowRUBalanceByUserController
}