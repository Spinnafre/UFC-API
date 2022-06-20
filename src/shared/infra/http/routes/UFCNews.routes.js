const {Router}=require("express")

const showNewsController=require('../../../../modules/ufc_news/useCases/showNews')
const showHighlightsNewsController=require('../../../../modules/ufc_news/useCases/showHighlightsNews')
const showFilteredEventsController=require("../../../../modules/ufc_news/useCases/showEventsByFilterType")
const showMainEventsController=require("../../../../modules/ufc_news/useCases/showMainEvents")
const showEventsPerPageController=require("../../../../modules/ufc_news/useCases/showEventsPerPage")

const router=Router()

router.get('/',(req,res)=>{
    return showNewsController().handle(req,res)
})

router.get('/highlightsNews',(req,res)=>{
    return showHighlightsNewsController().handle(req,res)
})

router.get('/events',(req,res)=>{
    return showFilteredEventsController().handle(req,res)
})

router.get('/events/:id',(req,res)=>{
    return showEventsPerPageController().handle(req,res)
})

router.get('/main-events',(req,res)=>{
    return showMainEventsController().handle(req,res)
})


module.exports=router