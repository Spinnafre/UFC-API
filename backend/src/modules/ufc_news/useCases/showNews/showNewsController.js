class ShowNewsController{
    constructor(showNewsUseCase){
        this.showNewsUseCase=showNewsUseCase
    }
    async handle(req,res){
        try {
            const {show}=req.query
            const result=await this.showNewsUseCase.execute(show)
            return res.status(200).json(result)
        } catch (error) {
            return res.status(400).json({
                msg:error.message
            })
        }
    }
}

module.exports={
    ShowNewsController
}