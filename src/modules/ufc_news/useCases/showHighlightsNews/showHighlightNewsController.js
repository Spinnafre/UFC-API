class ShowHighlightsNewsController{
    constructor(showHighlightsNewsUseCase){
        this.showHighlightsNewsUseCase=showHighlightsNewsUseCase
    }
    async handle(req,res){
        try {
            const result=await this.showHighlightsNewsUseCase.execute()
            return res.status(200).json(result)
        } catch (error) {
            return res.status(400).json({
                msg:error.message
            })
        }
    }
}

module.exports={
    ShowHighlightsNewsController
}