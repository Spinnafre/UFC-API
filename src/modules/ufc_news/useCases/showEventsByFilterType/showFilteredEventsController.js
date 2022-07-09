class ShowFilteredEventsController{
    constructor(showFilteredEventsUseCase){
        this.showFilteredEventsUseCase=showFilteredEventsUseCase
    }
    async handle(req,res,next){
        try {
            const params=req.query
            const result=await this.showFilteredEventsUseCase.execute(params)
            return res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }
}

module.exports={
    ShowFilteredEventsController
}