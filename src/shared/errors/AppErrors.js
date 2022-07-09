//Emitir erros personalizáveis
class AppError extends Error{
    constructor({statusCode=400,message,isOperational=true,stack=''}){
        super(message)
        this.statusCode=statusCode
        this.isOperational=isOperational
        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

function handleError(err,res=null){
    if(!err.isOperational){
        console.log('Erro na execução da aplicação - ',err)
        console.log('[KILL] - Parando aplicação')
        //Se não for um Apperror então desliga a aplicação
        process.exit(1)
    }
  
    return res.status(err.statusCode).json({msg:err.message})
  }

module.exports={
    AppError,
    handleError
}