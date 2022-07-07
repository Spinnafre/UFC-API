class GetAllNewsController{
    constructor(getAllNewsUseCase){
        this.getAllNewsUseCase=getAllNewsUseCase
    }
    async handle(req,res){
        const {pageNumber,title,domain}=req.query
        try {
            const result=await this.getAllNewsUseCase.execute(pageNumber,title,domain)
            return res.status(200).json(result)
        } catch (error) {
            return res.status(400).json({
                msg:`Falha ao realizar busca de notícias no domínio ${domain} - ${error.message}`
            })
        }
    }
}

module.exports={
    GetAllNewsController
}