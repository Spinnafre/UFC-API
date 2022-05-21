const {Router}=require("express")

const showRUMenuByDayController=require('../../../../modules/ufc_ru/menu')
const showRUBalanceByUserController=require('../../../../modules/ufc_ru/balance')

const router=Router()

router.get('/byDay',(req,res)=>{
    return showRUMenuByDayController().handle(req,res)
})

router.get('/getUserBalance',(req,res)=>{
    return showRUBalanceByUserController().handle(req,res)
})

module.exports=router