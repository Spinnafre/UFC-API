class ShowHighlightsEventsController{
    constructor(showHighlightsEventsUseCase){
        this.showHighlightsEventsUseCase=showHighlightsEventsUseCase
    }
    async handle(req,res){
        try {
            const result=await this.showHighlightsEventsUseCase.execute()
            return res.status(200).json(result)
        } catch (error) {
            return res.status(400).json({
                msg:"Falha ao tentar buscar informações de eventos principais - "+error.message
            })
        }
    }
}

module.exports={
    ShowHighlightsEventsController
}