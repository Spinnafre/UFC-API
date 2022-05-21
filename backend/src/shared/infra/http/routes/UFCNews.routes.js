const {Router}=require("express")

const showNewsController=require('../../../../modules/ufc_news/useCases/showNews')

const router=Router()

router.get('/',(req,res)=>{
    return showNewsController().handle(req,res)
})

module.exports=router