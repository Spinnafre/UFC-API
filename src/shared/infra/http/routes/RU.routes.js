const {Router}=require("express")

const showRUMenuByDayController=require('../../../../modules/ufc_ru/menu')
const showRUBalanceByUserController=require('../../../../modules/ufc_ru/balance')

const router=Router()

router.get('/byDay',(req,res,next)=>{
    return showRUMenuByDayController().handle(req,res,next)
})

router.get('/getUserBalance',(req,res,next)=>{
    return showRUBalanceByUserController().handle(req,res,next)
})

module.exports=router