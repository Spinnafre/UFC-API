class ShowFilteredEventsController{
    constructor(showFilteredEventsUseCase){
        this.showFilteredEventsUseCase=showFilteredEventsUseCase
    }
    async handle(req,res){
        try {
            const params=req.query
            const result=await this.showFilteredEventsUseCase.execute(params)
            return res.status(200).json(result)
        } catch (error) {
            return res.status(400).json({
                msg:error.message
            })
        }
    }
}

module.exports={
    ShowFilteredEventsController
}